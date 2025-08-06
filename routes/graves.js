const express = require('express');
const Grave = require('../models/Grave');
const { protect, authorize, checkPermission } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all graves
// @route   GET /api/graves
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { section, status, graveType, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    if (section) filter.section = section;
    if (status) filter.status = status;
    if (graveType) filter.graveType = graveType;

    // If client, only show their graves
    if (req.user.role === 'client') {
      filter.owner = req.user.id;
    }

    const graves = await Grave.find(filter)
      .populate('owner', 'firstName lastName email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Grave.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: graves.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: graves
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single grave
// @route   GET /api/graves/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const grave = await Grave.findById(req.params.id)
      .populate('owner', 'firstName lastName email phone')
      .populate('maintenance.assignedTo', 'firstName lastName');

    if (!grave) {
      return res.status(404).json({
        success: false,
        message: 'Grave not found'
      });
    }

    // If client, ensure they own this grave
    if (req.user.role === 'client' && grave.owner && grave.owner._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this grave'
      });
    }

    res.status(200).json({
      success: true,
      data: grave
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new grave
// @route   POST /api/graves
// @access  Private (Staff/Admin only)
router.post('/', protect, authorize('staff', 'admin'), checkPermission('manage_graves'), async (req, res) => {
  try {
    const grave = await Grave.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Grave created successfully',
      data: grave
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error during grave creation',
      error: error.message
    });
  }
});

// @desc    Update grave
// @route   PUT /api/graves/:id
// @access  Private (Staff/Admin only)
router.put('/:id', protect, authorize('staff', 'admin'), checkPermission('manage_graves'), async (req, res) => {
  try {
    const grave = await Grave.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!grave) {
      return res.status(404).json({
        success: false,
        message: 'Grave not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Grave updated successfully',
      data: grave
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete grave
// @route   DELETE /api/graves/:id
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const grave = await Grave.findById(req.params.id);

    if (!grave) {
      return res.status(404).json({
        success: false,
        message: 'Grave not found'
      });
    }

    await Grave.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Grave deleted successfully'
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