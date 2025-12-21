// src/api/integrations.js
import { api } from "./httpClient";

// Example wrapper for LLM/chatbot usage
export async function invokeLLM(payload) {
  // adjust path and payload shape to match your backend /api/chatbot route
  return api.post("/api/chatbot", payload);
}

// If you later add email, file uploads, etc., define wrappers here:
export async function sendEmail(payload) {
  return api.post("/api/notifications/email", payload);
}
// export async function uploadFile(payload) {
//   return api.post("/api/files/upload", payload);
// }






//import { base44 } from './base44Client';




// export const Core = base44.integrations.Core;

// export const InvokeLLM = base44.integrations.Core.InvokeLLM;

// export const SendEmail = base44.integrations.Core.SendEmail;

// export const UploadFile = base44.integrations.Core.UploadFile;

// export const GenerateImage = base44.integrations.Core.GenerateImage;

// export const ExtractDataFromUploadedFile = base44.integrations.Core.ExtractDataFromUploadedFile;

// export const CreateFileSignedUrl = base44.integrations.Core.CreateFileSignedUrl;

// export const UploadPrivateFile = base44.integrations.Core.UploadPrivateFile;






