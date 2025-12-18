import mongoose, { Document, Schema } from "mongoose";

export type OrderStatus = "pending" | "cooking" | "ready" | "served" | "paid";

interface IOrderItem {
  name: string;
  qty: number;
  price: number;
}

interface IOrder extends Document {
  tableNumber: number;
  customerId: string;
  customerName: string;
  items: IOrderItem[];
  status: OrderStatus;
  totalAmount: number;
  paymentMethod?: string;
  paymentStatus?: "pending" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    tableNumber: { type: Number, required: true, index: true },
    customerId: { type: String, required: true },
    customerName: { type: String, required: true },
    items: [
      {
        name: String,
        qty: Number,
        price: Number,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "cooking", "ready", "served", "paid"],
      default: "pending",
    },
    totalAmount: { type: Number, default: 0 },
    paymentMethod: { type: String, default: null },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", orderSchema);
