import mongoose, { Schema } from "mongoose";

const serviceSchema = new mongoose.Schema({
    serviceProvider: { type: Schema.Types.ObjectId, ref: "ServiceProviders" },
    serviceTitle: { type: String, required: [true, "Service Title is required"] },
    serviceType: { type: String, required: [true, "Service Type is required"] },
    location: { type: String, required: [true, "Location is required"] },
    salary: { type: Number, required: [true, "Salary is required"] },
    experience: { type: Number, default: 0 },
    detail: [
        { 
            desc: { type: String },
            requirements: { type: String }
        }
    ],
    application: [{ type: Schema.Types.ObjectId, ref: "Users" }],

    bookings: [
        {
            date: { type: Date, required: true },
            user: { type: Schema.Types.ObjectId, ref: "Users", required: true }
        }
    ]
},
{ timestamps: true });

const Services = mongoose.model("Services", serviceSchema);

export default Services;