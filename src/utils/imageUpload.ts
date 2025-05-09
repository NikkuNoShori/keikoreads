import { supabase } from './supabaseClient';

/**
 * Upload an image file to Supabase storage
 * @param file The file to upload
 * @param path Optional path within the bucket (e.g., 'covers/')
 * @returns URL of the uploaded image or null if upload failed
 */
export const uploadImage = async (file: File, path: string = ''): Promise<string | null> => {
  try {
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}${Date.now().toString()}.${fileExt}`;
    const filePath = path ? `${path}${fileName}` : fileName;

    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
      .from('book-covers')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading file:', error.message);
      return null;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('book-covers')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadImage:', error);
    return null;
  }
};

/**
 * Delete an image from Supabase storage
 * @param url The public URL of the image to delete
 * @returns true if deletion was successful
 */
export const deleteImage = async (url: string): Promise<boolean> => {
  try {
    // Extract the path from the URL
    const path = url.split('/').pop();
    if (!path) return false;

    const { error } = await supabase.storage
      .from('book-covers')
      .remove([path]);

    if (error) {
      console.error('Error deleting file:', error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteImage:', error);
    return false;
  }
}; 