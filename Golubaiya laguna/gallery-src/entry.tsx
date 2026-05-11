import { createRoot } from "react-dom/client";
import StellarCardGallery from "./StellarCardGallery";
import "./gallery.css";

var mount = document.getElementById("gallery-3d-root");
if (mount) {
  createRoot(mount).render(<StellarCardGallery />);
}
