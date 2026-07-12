import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema(
  {
    score: { type: Number, default: null },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    betterAnswer: { type: String, default: '' },
    tips: { type: [String], default: [] },
    modelName: { type: String, default: '' },
    rawResponse: { type: mongoose.Schema.Types.Mixed, default: null }
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    answerText: { type: String, default: '' },
    evaluation: { type: evaluationSchema, default: null },
    answeredAt: { type: Date, default: null }
  },
  { _id: false }
);

const sessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    title: { type: String, required: true },
    role: { type: String, required: true },
    level: { type: String, required: true },
    sourceType: { type: String, enum: ['resume', 'job-description'], required: true },
    sourceText: { type: String, required: true },
    sourceFileName: { type: String, default: '' },
    sourceFileType: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'active', 'completed', 'deleted'], default: 'draft' },
    currentQuestionIndex: { type: Number, default: 0 },
    questions: { type: [questionSchema], default: [] },
    completedAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

sessionSchema.index({ createdAt: -1 });
sessionSchema.index({ status: 1, createdAt: -1 });
sessionSchema.index({ role: 1, level: 1 });

export default mongoose.models.Session || mongoose.model('Session', sessionSchema);