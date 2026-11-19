u2netp.onnx: U-2-Netp background removal model (Qin et al., U^2-Net), Apache License 2.0.
ONNX export from https://huggingface.co/BritishWerewolf/U-2-Netp
Used by RAIL Studio photos, runs on the device.

fashion-siglip-vision.onnx: image half of Marqo-FashionSigLIP (fine-tuned from ViT-B-16-SigLIP), Apache License 2.0.
4-bit ONNX export (onnx/vision_model_q4.onnx) from https://huggingface.co/Marqo/marqo-fashionSigLIP
Used by RAIL Detect from photo, runs on the device.

detect-labels.json: the model's text half run once over RAIL's list of garment kinds and patterns
("a photo of a <kind>"), stored as 16-bit integers with one scale per vector. "format" must match
FORMAT in index.html. Rebuilding it needs the text model and the build script; the kinds list lives
in the "kinds" field (category, name, layer).
