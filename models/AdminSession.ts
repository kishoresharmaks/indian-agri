import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdminSession extends Document {
  sessionToken: string;
  expiresAt: Date;
  lastActivityAt: Date;
  ipAddress: string;
  userAgent: string;
  isRevoked: boolean;
  createdAt: Date;
}

const AdminSessionSchema: Schema = new Schema(
  {
    sessionToken: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    lastActivityAt: { type: Date, required: true, default: Date.now },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    isRevoked: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

AdminSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

AdminSessionSchema.statics.findValid = function (this: Model<IAdminSession>, token: string) {
  return this.findOne({
    sessionToken: token,
    isRevoked: false,
    expiresAt: { $gt: new Date() },
  });
};

AdminSessionSchema.statics.cleanupExpired = function () {
  return this.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      { isRevoked: true },
    ],
  });
};

const AdminSession: Model<IAdminSession> =
  mongoose.models.AdminSession ||
  mongoose.model<IAdminSession>('AdminSession', AdminSessionSchema);

export default AdminSession;
