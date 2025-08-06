const express = require('express');
const Grave = require('../models/Grave');
const { protect, authorize, checkPermission } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all maintenance records
// @route   GET /api/maintenance
// @access  Private (Staff/Admin only)
router.get('/', protect, authorize('staff', 'admin'), checkPermission('manage_maintenance'), async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    // Build aggregation pipeline
    const pipeline = [
      { $unwind: '$maintenance' },
      {
        $lookup: {
          from: 'users',
          localField: 'maintenance.assignedTo',
          foreignField: '_id',
          as: 'maintenance.assignedTo'
        }
      },
      {
        $unwind: {
          path: '$maintenance.assignedTo',
          preserveNullAndEmptyArrays: true
        }
      }
    ];

    // Add status filter if provided
    if (status) {
      pipeline.push({
        $match: { 'maintenance.status': status }
      });
    }

    // Add pagination
    pipeline.push(
      { $sort: { 'maintenance.scheduledDate': -1 } },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) }
    );

    const maintenanceRecords = await Grave.aggregate(pipeline);

    res.status(200).json({
      success: true,
      count: maintenanceRecords.length,
      page: parseInt(page),
      data: maintenanceRecords
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create maintenance record
// @route   POST /api/maintenance
// @access  Private (Staff/Admin only)
router.post('/', protect, authorize('staff', 'admin'), checkPermission('manage_maintenance'), async (req, res) => {
  try {
    const { graveId, type, description, scheduledDate, assignedTo, cost } = req.body;

    const grave = await Grave.findById(graveId);
    
    if (!grave) {
      return res.status(404).json({
        success: false,
        message: 'Grave not found'
      });
    }

    grave.maintenance.push({
      type,
      description,
      scheduledDate,
      assignedTo,
      cost: cost || 0
    });

    await grave.save();

    res.status(201).json({
      success: true,
      message: 'Maintenance record created successfully',
      data: grave.maintenance[grave.maintenance.length - 1]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error during maintenance creation',
      error: error.message
    });
  }
});

// @desc    Update maintenance record
// @route   PUT /api/maintenance/:graveId/:maintenanceId
// @access  Private (Staff/Admin only)
router.put('/:graveId/:maintenanceId', protect, authorize('staff', 'admin'), checkPermission('manage_maintenance'), async (req, res) => {
  try {
    const { graveId, maintenanceId } = req.params;
    
    const grave = await Grave.findById(graveId);
    
    if (!grave) {
      return res.status(404).json({
        success: false,
        message: 'Grave not found'
      });
    }

    const maintenance = grave.maintenance.id(maintenanceId);
    
    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance record not found'
      });
    }

    // Update maintenance record
    Object.keys(req.body).forEach(key => {
      maintenance[key] = req.body[key];
    });

    await grave.save();

    res.status(200).json({
      success: true,
      message: 'Maintenance record updated successfully',
      data: maintenance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete maintenance record
// @route   DELETE /api/maintenance/:graveId/:maintenanceId
// @access  Private (Admin only)
router.delete('/:graveId/:maintenanceId', protect, authorize('admin'), async (req, res) => {
  try {
    const { graveId, maintenanceId } = req.params;
    
    const grave = await Grave.findById(graveId);
    
    if (!grave) {
      return res.status(404).json({
        success: false,
        message: 'Grave not found'
      });
    }

    grave.maintenance.pull({ _id: maintenanceId });
    await grave.save();

    res.status(200).json({
      success: true,
      message: 'Maintenance record deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;