import { apiClient } from "@/hooks/useTanstackQuery";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getOrdinal = (number) => {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = number % 100;
  return number + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
};

export function capitalizeWords(str) {
  // Split the string into words
  let words = str?.split(" ");

  // Capitalize the first letter of each word
  for (let i = 0; i < words?.length; i++) {
    words[i] =
      words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
  }

  // Join the words back together
  return words?.join(" ");
}

// export function isUserAllowed(role: string, allowedRoles: (Role | "ALL")[]) {
//   return allowedRoles.includes("ALL") || allowedRoles.includes(role as Role);
// }

export const handleImageDeleteOrReplace = async (publicId) => {
  apiClient.delete(`/cloudinary/${publicId}`);
  // const {secure_url, public_id} = await cloudinaryUpload(file, 'next-alumni-system')
};

export const uploadPhoto = async (file) => {
  const formData = new FormData();
  const compressedFile = (await handleImageCompression(file)) // as File;
  formData.append("upload_preset", "cv-connect");
  formData.append("file", compressedFile);

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/dbotdcaxi/auto/upload`,
    formData,
    {
      headers: { "X-Requested-With": "XMLHttpRequest" },
    }
  );

  return {
    url: res.data.url,
    public_id: res.data.url,
  };
};

export function isFile(variable) {
  return variable instanceof File || 
         (typeof variable === "object" && variable !== null && "name" in variable && "size" in variable);
}



export const dataURItoBlob = (dataURI) => {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  const byteString = atob(dataURI.split(",")[1]);

  // separate out the mime component
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
};

export const handleImageCompression = async (file) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  try {
    // console.log('before compressed', file.size / 1024 / 1024 + 'MB')
    const compressedFile = await imageCompression(file, options);
    // console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

    // console.log('compressed file', compressedFile)
    return compressedFile;
  } catch (error) {
    console.log(error);
  }
};