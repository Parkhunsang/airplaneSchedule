import { useMemo } from "react";
import { useWorkflowStore } from "../store/useWorkflowStore";

export const useThumbnailWorkflow = ({
  workflowKey,
  defaultWorkflowKey,
}) => {
  const thumbnailCache = useWorkflowStore((state) => state.thumbnailCache);
  const setThumbnailForWorkflow = useWorkflowStore(
    (state) => state.setThumbnailForWorkflow,
  );
  const resetThumbnailForWorkflow = useWorkflowStore(
    (state) => state.resetThumbnailForWorkflow,
  );

  const currentThumbnail = useMemo(
    () =>
      thumbnailCache[workflowKey] ?? {
        fileName: "",
        dimensions: null,
        previewUrl: "",
      },
    [thumbnailCache, workflowKey],
  );

  const handleThumbnailSelect = (file) => {
    if (!file) {
      setThumbnailForWorkflow(workflowKey, {
        fileName: "",
        dimensions: null,
        previewUrl: "",
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const previewUrl = typeof reader.result === "string" ? reader.result : "";
      const image = new Image();

      image.onload = () => {
        setThumbnailForWorkflow(workflowKey, {
          fileName: file.name,
          dimensions: {
            width: image.naturalWidth,
            height: image.naturalHeight,
          },
          previewUrl,
        });
      };

      image.onerror = () => {
        setThumbnailForWorkflow(workflowKey, {
          fileName: file.name,
          dimensions: null,
          previewUrl,
        });
      };

      image.src = previewUrl;
    };

    reader.readAsDataURL(file);
  };

  const resetDefaultWorkflowThumbnail = () => {
    resetThumbnailForWorkflow(defaultWorkflowKey);
  };

  return {
    thumbnailFileName: currentThumbnail.fileName,
    thumbnailDimensions: currentThumbnail.dimensions,
    thumbnailPreviewUrl: currentThumbnail.previewUrl,
    thumbnailCache,
    handleThumbnailSelect,
    resetDefaultWorkflowThumbnail,
  };
};
