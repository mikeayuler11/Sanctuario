const express = require('express');
const Inquiry = require('../models/Inquiry');
const { protect, authorize, checkPermission } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, category, priority, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    // If client, only show their inquiries
    if (req.user.role === 'client') {
      filter.client = req.user.id;
    }

    const inquiries = await Inquiry.find(filter)
      .populate('client', 'firstName lastName email')
      .populate('assignedTo', 'firstName lastName')
      .populate('relatedGrave', 'plotNumber section')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Inquiry.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: inquiries.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: inquiries
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single inquiry
// @route   GET /api/inquiries/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('client', 'firstName lastName email phone')
      .populate('assignedTo', 'firstName lastName')
      .populate('relatedGrave', 'plotNumber section block row')
      .populate('responses.user', 'firstName lastName role');

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    // If client, ensure they own this inquiry
    if (req.user.role === 'client' && inquiry.client._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this inquiry'
      });
    }

    res.status(200).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new inquiry
// @route   POST /api/inquiries
// @access  Private (Client only)
router.post('/', protect, async (req, res) => {
  try {
    const { subject, message, category, relatedGrave } = req.body;

    const inquiry = await Inquiry.create({
      client: req.user.id,
      subject,
      message,
      category,
      relatedGrave
    });

    await inquiry.populate('client', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Inquiry created successfully',
      data: inquiry
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error during inquiry creation',
      error: error.message
    });
  }
});

// @desc    Add response to inquiry
// @route   POST /api/inquiries/:id/responses
// @access  Private
router.post('/:id/responses', protect, async (req, res) => {
  try {
    const { message, isInternal = false } = req.body;

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    // If client, ensure they own this inquiry and response is not internal
    if (req.user.role === 'client') {
      if (inquiry.client.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to respond to this inquiry'
        });
      }
      if (isInternal) {
        return res.status(403).json({
          success: false,
          message: 'Clients cannot create internal responses'
        });
      }
    }

    inquiry.responses.push({
      user: req.user.id,
      message,
      isInternal: req.user.role !== 'client' ? isInternal : false
    });

    await inquiry.save();
    await inquiry.populate('responses.user', 'firstName lastName role');

    res.status(201).json({
      success: true,
      message: 'Response added successfully',
      data: inquiry
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update inquiry
// @route   PUT /api/inquiries/:id
// @access  Private (Staff/Admin only)
router.put('/:id', protect, authorize('staff', 'admin'), checkPermission('manage_inquiries'), async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Inquiry updated successfully',
      data: inquiry
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