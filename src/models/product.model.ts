import mongoose from 'mongoose';

import { UserDoc } from './user.model';

// Describes what properties are required to create a product
export interface ProductAttrs {
  name: string;
  imageURL: string;
  category: string;
  description: string;
  price: number;
  countInStock: number;
}

// Describes what properties and methods a product document has
export interface ProductDoc extends mongoose.Document {
  user: UserDoc;
  name: string;
  imageURL: string;
  category: string;
  description: string;
  price: number;
  countInStock: number;
}

// Describes what properties and methods a product model has
export interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs & { user: UserDoc }): ProductDoc;
}

const ProductSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  imageURL: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  countInStock: {
    type: Number,
    required: true,
  },
});

ProductSchema.statics.build = (attrs: ProductAttrs) => new Product(attrs);

const Product = mongoose.model<ProductDoc, ProductModel>('Product', ProductSchema);
export { Product };
