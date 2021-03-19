import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTrash,
  faSignOutAlt,
  faEdit,
  faBan,
  faSpinner,
  faPlusSquare,
  faEnvelope,
  faMapMarkerAlt,
  faLock
} from "@fortawesome/free-solid-svg-icons";

const Icons = () => {
  return library.add(
    faTrash, 
    faSignOutAlt, 
    faEdit, 
    faBan, 
    faSpinner,
    faPlusSquare,
    faEnvelope,
    faMapMarkerAlt,
    faLock
  ); // adding icons from fontawesome
}

export default Icons;