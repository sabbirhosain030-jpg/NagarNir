import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

export async function uploadToCloudinary(
  file: string,
  folder: 'nagar-nirmata/projects' | 'nagar-nirmata/team'
) {
  const isTeam = folder.includes('team');
  const result = await cloudinary.uploader.upload(file, {
    folder,
    transformation: isTeam
      ? [
          { width: 400, height: 400, crop: 'fill', gravity: 'face', quality: 'auto', fetch_format: 'auto' },
        ]
      : [
          { width: 900, height: 675, crop: 'fill', quality: 'auto', fetch_format: 'auto' },
        ],
  });
  return { url: result.secure_url, public_id: result.public_id };
}

export async function deleteFromCloudinary(publicId: string) {
  await cloudinary.uploader.destroy(publicId);
}
