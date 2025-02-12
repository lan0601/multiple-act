import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import { useAuth } from "../utils/auth";
import DashboardLayout from "../layouts/DashboardLayouts";
// import { Toast } from "bootstrap";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState(""); // Editable file name
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState(""); // "success" or "error"
  const toastRef = useRef(null);

  const router = useRouter();
  const { logout } = useAuth();
  let userData;

  useEffect(() => {
    // showToast("Toast test message!", "success");
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        userData=session.user;
        fetchPhotos();
      } else {
        router.push("/login");
      }
    };
    fetchSession();
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchPhotos(); // Only fetch photos when user is available
    }
  }, [user]);

  const fetchPhotos = async () => {
    if (!user) return;
    const { data, error } = await supabase.from("photos").select("id, user_id, url").eq("user_id",user.id);
    if (error) {
      console.error("Error fetching photos:", error);
    } else {
      setPhotos(data);
    }
  };

  const closeModal = async() => {
    // Close modal
    alert('g')
    const modal = document.getElementById("uploadPhotoModal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile || !fileName) return;
    setLoading(true);
  
    const fileExt = selectedFile.name.split(".").pop();
    const newFileName = `${fileName}.${fileExt}`; 
    const filePath = `uploads/${user.id}/${newFileName}`;
  
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("photos")
      .upload(filePath, selectedFile);
  
    if (uploadError) {
      console.error("Upload error:", uploadError);
      showToast("Failed to upload photo", "error");
      setLoading(false);
      return; 
    }
  
    console.log("File uploaded at:", filePath);
  
    // Get public URL
    const { data } = supabase.storage.from("photos").getPublicUrl(filePath);
    const publicURL = data.publicUrl;
  
    // Insert into database
    const { data: insertData, error: insertError } = await supabase
      .from("photos")
      .insert([{ user_id: user.id, url: publicURL }]);
  
    if (insertError) {
      showToast("Failed to save photo in database", "error");
    } else {
      showToast("Photo uploaded successfully!", "success");
  
      // Reset fields and close modal
      
      // closeModal();
      setTimeout(() => {
        const modalElement = document.getElementById("uploadPhotoModal");
        if (modalElement) {
          modalElement.classList.remove("show");
          modalElement.style.display = "none";
          document.body.classList.remove("modal-open");
          document.querySelector(".modal-backdrop")?.remove();
        }
      }, 300);
      fetchPhotos();
      setSelectedFile("");
      setFileName("");
    }
  
    setLoading(false);
  };
  

  const handleDelete = async (photoId, photoUrl) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    setLoading(true);

    const filePath = photoUrl.split("/o/")[1].split("?")[0];
    const { error: storageError } = await supabase.storage.from("photos").remove([filePath]);
    
    if (storageError) {
      console.error("Storage delete error:", storageError);
      showToast("Failed to delete photo", "error");
    } else {
      await supabase.from("photos").delete().eq("id", photoId);
      fetchPhotos();
      showToast("Photo deleted successfully!", "success");
    }

    setLoading(false);
  };

  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
  
    setTimeout(() => {
      if (toastRef.current) {
        import("bootstrap").then((bootstrap) => {
          const toastElement = new bootstrap.Toast(toastRef.current);
          toastElement.show();
        });
      }
    }, 1500); // Small delay to ensure UI updates
  };

  if (!user) return <p>Loading...</p>;

  return (
    <DashboardLayout logout={logout}>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h2>Photo Gallery</h2>
          </div>
          <div className="d-flex col-md-6 justify-content-end">
            {/* Open Modal Button */}
            <button
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#uploadPhotoModal"
              onClick={() => {
                setSelectedFile(null);  // Reset file
                setFileName("");  // Clear input field
              }}
            >
              Upload Photo
            </button>
          </div>
        </div>

        {/* Photo Grid */}
        <div className="photo-gallery-container">
          <div className="row mt-3">
            {photos.map((photo) => (
              <div key={photo.id} className="col-md-4 d-flex flex-column align-items-center">
                <div className="photo-container">
                  <img src={photo.url} alt="Uploaded" className="photo-img" />
                </div>
                <div>
                  <button className="btn btn-warning m-2" onClick={() => handleDelete(photo.id, photo.url)}>
                    Edit
                  </button>
                  <button className="btn btn-danger m-2" onClick={() => handleDelete(photo.id, photo.url)}>
                    Delete
                  </button>
                </div>
                
              </div>
            ))}
          </div>
        </div>
        

        {/* Bootstrap Modal for Uploading */}
        <div className="modal fade" id="uploadPhotoModal" tabIndex="-1" aria-labelledby="uploadPhotoModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="uploadPhotoModalLabel">Upload Photo</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <input type="file" onChange={handleFileChange} className="form-control mb-3" />
                {selectedFile && (
                  <>
                    <label>Photo Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                    />
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleUpload} disabled={loading || !selectedFile}>
                  {loading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bootstrap Toast Notification */}
        <div className="toast-container position-fixed top-0 end-0 p-3">
          <div 
            ref={toastRef} 
            className={`toast align-items-center text-white bg-${toastType === "success" ? "success" : "danger"} border-0`}
            role="alert" 
            aria-live="assertive" 
            aria-atomic="true"
            data-bs-delay="1000"
            data-bs-autohide="true"
          >
            <div className="d-flex">
              <div className="toast-body">
                {toastMessage}
              </div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
