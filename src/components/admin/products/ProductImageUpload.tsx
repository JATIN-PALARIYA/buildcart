import React from "react";
import { Upload, X } from "lucide-react";

interface ProductImageUploadProps {
  imagesList: string[];
  selectedFiles: File[];
  isUploading: boolean;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImageAtIndex: (index: number) => void;
  onRemovePendingFile: (index: number) => void;
}

export function ProductImageUpload({
  imagesList,
  selectedFiles,
  isUploading,
  onFileSelect,
  onRemoveImageAtIndex,
  onRemovePendingFile,
}: ProductImageUploadProps) {
  const maxImages = 5;
  const canUploadMore = imagesList.length < maxImages;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-semibold text-muted-foreground">
          Product Images ({imagesList.length}/{maxImages})
        </label>
        {imagesList.length === maxImages && (
          <span className="text-[10px] text-amber-500 font-bold">
            Max limit of {maxImages} images reached
          </span>
        )}
      </div>

      {/* 1. Grid of current images */}
      {imagesList.length > 0 && (
        <div className="grid grid-cols-5 gap-2.5">
          {imagesList.map((url, idx) => (
            <div
              key={idx}
              className="relative aspect-square bg-muted rounded-xl border border-border overflow-hidden group shadow-sm flex items-center justify-center"
            >
              <img
                src={url}
                alt={`Product preview ${idx + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemoveImageAtIndex(idx)}
                className="absolute top-1 right-1 p-1 bg-background/90 hover:bg-destructive/20 border border-border hover:text-destructive text-foreground rounded-lg transition-colors cursor-pointer shadow-sm"
                title="Remove Image"
              >
                <X size={12} />
              </button>
              {idx === 0 && (
                <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[8px] font-bold px-1 py-0.5 rounded shadow-sm uppercase tracking-wider">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}

        {/* File selection block (no immediate upload) */}
        {canUploadMore && (
          <div className="space-y-3">
            <label
              htmlFor="product-image-upload"
              className="border border-dashed border-border hover:border-primary/50 cursor-pointer rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 transition-all bg-muted/20 hover:bg-muted/30 text-center"
            >
              <Upload className="h-4.5 w-4.5 text-muted-foreground/60" />
              <div className="space-y-0.5">
                <span className="text-[11px] font-semibold text-foreground block">
                  Choose product image files
                </span>
                <span className="text-[9px] text-muted-foreground block font-medium">
                  PNG, JPG, or WEBP up to 5MB each (Select up to {maxImages - imagesList.length} more)
                </span>
              </div>
              <input
                type="file"
                id="product-image-upload"
                accept="image/*"
                multiple
                onChange={onFileSelect}
                className="hidden"
                disabled={isUploading}
              />
            </label>
            {/* Show pending selected files with remove option */}
            {selectedFiles && selectedFiles.length > 0 && (
              <div className="mt-2 space-y-1">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between px-2 py-1 bg-muted/30 rounded">
                    <span className="text-[10px] truncate">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    <button
                      type="button"
                      onClick={() => onRemovePendingFile(idx)}
                      className="p-0.5 hover:bg-muted text-muted-foreground rounded transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
    </div>
  );
}
export default ProductImageUpload;
