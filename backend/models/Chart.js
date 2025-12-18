const mongoose = require('mongoose');

const PlanetSchema = new mongoose.Schema({
  sign: {
    type: String,
    required: true,
    enum: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
           'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
  },
  degree: {
    type: Number,
    required: true,
    min: 0,
    max: 29
  }
}, { _id: false });

const ChartSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    default: function() {
      return `Chart for ${this.birthLocation}`;
    }
  },
  birthDate: {
    type: Date,
    required: true
  },
  birthTime: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  birthLocation: {
    type: String,
    required: true,
    trim: true
  },
  latitude: {
    type: Number,
    required: false
  },
  longitude: {
    type: Number,
    required: false
  },
  sunSign: {
    type: String,
    required: true,
    enum: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
           'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
  },
  moonSign: {
    type: String,
    required: true,
    enum: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
           'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
  },
  risingSign: {
    type: String,
    required: true,
    enum: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
           'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
  },
  planets: {
    sun: {
      type: PlanetSchema,
      required: true
    },
    moon: {
      type: PlanetSchema,
      required: true
    },
    mercury: {
      type: PlanetSchema,
      required: true
    },
    venus: {
      type: PlanetSchema,
      required: true
    },
    mars: {
      type: PlanetSchema,
      required: true
    },
    jupiter: {
      type: PlanetSchema,
      required: false
    },
    saturn: {
      type: PlanetSchema,
      required: false
    },
    uranus: {
      type: PlanetSchema,
      required: false
    },
    neptune: {
      type: PlanetSchema,
      required: false
    },
    pluto: {
      type: PlanetSchema,
      required: false
    }
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster queries
ChartSchema.index({ birthDate: 1 });
ChartSchema.index({ sunSign: 1 });
ChartSchema.index({ createdAt: -1 });

// Virtual for formatted birth date
ChartSchema.virtual('formattedBirthDate').get(function() {
  return this.birthDate.toISOString().split('T')[0];
});

module.exports = mongoose.model('Chart', ChartSchema);

