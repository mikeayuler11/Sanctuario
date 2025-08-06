const mongoose = require('mongoose');

const GraveSchema = new mongoose.Schema({
  plotNumber: {
    type: String,
    required: [true, 'Plot number is required'],
    unique: true,
    trim: true
  },
  section: {
    type: String,
    required: [true, 'Section is required'],
    trim: true
  },
  block: {
    type: String,
    required: [true, 'Block is required'],
    trim: true
  },
  row: {
    type: String,
    required: [true, 'Row is required'],
    trim: true
  },
  graveType: {
    type: String,
    enum: ['single', 'double', 'family', 'mausoleum'],
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'occupied', 'maintenance'],
    default: 'available'
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  deceased: [{
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    dateOfDeath: {
      type: Date,
      required: true
    },
    relationToOwner: {
      type: String,
      trim: true
    },
    epitaph: {
      type: String,
      maxlength: 500
    }
  }],
  coordinates: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  dimensions: {
    length: {
      type: Number,
      required: true
    },
    width: {
      type: Number,
      required: true
    }
  },
  amortization: {
    totalAmount: {
      type: Number,
      default: 0
    },
    paidAmount: {
      type: Number,
      default: 0
    },
    remainingAmount: {
      type: Number,
      default: 0
    },
    installments: [{
      amount: {
        type: Number,
        required: true
      },
      dueDate: {
        type: Date,
        required: true
      },
      paidDate: {
        type: Date,
        default: null
      },
      status: {
        type: String,
        enum: ['pending', 'paid', 'overdue'],
        default: 'pending'
      }
    }]
  },
  maintenance: [{
    type: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    scheduledDate: {
      type: Date,
      required: true
    },
    completedDate: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
      default: 'scheduled'
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cost: {
      type: Number,
      default: 0
    }
  }],
  notes: {
    type: String,
    maxlength: 1000
  }
}, {
  timestamps: true
});

// Calculate remaining amount when amortization is updated
GraveSchema.pre('save', function(next) {
  if (this.amortization && this.amortization.totalAmount) {
    this.amortization.remainingAmount = this.amortization.totalAmount - this.amortization.paidAmount;
  }
  next();
});

// Virtual for full plot identifier
GraveSchema.virtual('fullPlotId').get(function() {
  return `${this.section}-${this.block}-${this.row}-${this.plotNumber}`;
});

module.exports = mongoose.model('Grave', GraveSchema);