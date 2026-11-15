export const publicRecipeFilter = {
  $or: [{ status: 'approved' }, { status: { $exists: false } }],
};
