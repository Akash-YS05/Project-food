import { Response } from 'express';
import { ProductModel } from '../models/Product';
import { socketService } from '../services/socketService';
import { AuthenticatedRequest } from '../types/auth';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

export const listProducts = asyncHandler(async (req, res: Response) => {
  const { category, search, sortBy } = req.query;
  const filter: Record<string, unknown> = {};

  if (category) filter.category = category;
  if (search) filter.name = { $regex: String(search), $options: 'i' };

  let query = ProductModel.find(filter);
  if (sortBy === 'price') {
    query = query.sort({ 'variants.0.price': 1 });
  } else if (sortBy === 'popularity') {
    query = query.sort({ rating: -1, reviewCount: -1 });
  } else {
    query = query.sort({ createdAt: -1 });
  }

  const products = await query.lean();
  res.json({
    data: products,
    meta: {
      total: products.length,
      page: 1,
      pageSize: products.length
    }
  });
});

export const getProductById = asyncHandler(async (req, res: Response) => {
  const product = await ProductModel.findById(req.params.id).lean();
  if (!product) {
    throw new ApiError(404, 'Product not found.');
  }
  res.json(product);
});

export const createProduct = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const product = await ProductModel.create({
    ...req.body,
    veg: true,
    badges: Array.from(new Set([...(req.body.badges ?? []), 'Pure Veg']))
  });

  socketService.emitToAll('products.updated', { productId: String(product._id) });
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const product = await ProductModel.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      veg: true,
      badges: Array.from(new Set([...(req.body.badges ?? []), 'Pure Veg']))
    },
    { new: true }
  );

  if (!product) {
    throw new ApiError(404, 'Product not found.');
  }

  socketService.emitToAll('products.updated', { productId: String(product._id) });
  res.json(product);
});

export const deleteProduct = asyncHandler(async (_req: AuthenticatedRequest, _res: Response) => {
  throw new ApiError(403, 'Deleting products is intentionally restricted. Soft disable availability instead.');
});

export const addProductReview = asyncHandler(async (req, res: Response) => {
  const { customerName, rating, comment } = req.body;
  const product = await ProductModel.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, 'Product not found.');
  }

  product.reviews.push({ customerName, rating, comment } as any);
  product.reviewCount = product.reviews.length;
  product.rating =
    product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / product.reviewCount;
  await product.save();

  res.status(201).json(product);
});
