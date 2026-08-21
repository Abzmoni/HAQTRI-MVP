// src/components/Marketplace/AddEditListing/AddEditListing.jsx
import React, { useState, useEffect } from "react";
import API from "../../../utils/api";
import "./AddEditListing.css";

export default function AddEditListing({ listing, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "property",
    type: "house",
    location: "",
    specifications: {},
    contactInfo: {
      phone: "",
      email: "",
      address: ""
    }
  });
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (listing) {
      setFormData({
        title: listing.title || "",
        description: listing.description || "",
        price: listing.price || "",
        category: listing.category || "property",
        type: listing.type || "house",
        location: listing.location || "",
        specifications: listing.specifications || {},
        contactInfo: listing.contactInfo || {
          phone: "",
          email: "",
          address: ""
        }
      });
    }
  }, [listing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: value
      }
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [name]: value
      }
    }));
  };

  const handleMediaChange = (e) => {
    setMediaFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("price", formData.price);
    submitData.append("category", formData.category);
    submitData.append("type", formData.type);
    submitData.append("location", formData.location);
    submitData.append("specifications", JSON.stringify(formData.specifications));
    submitData.append("contactInfo", JSON.stringify(formData.contactInfo));

    mediaFiles.forEach(file => {
      submitData.append("media", file);
    });

    try {
      let res;
      if (listing) {
        res = await API.put(`/listings/${listing._id}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await API.post("/listings", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (onSave) onSave(res.data);
    } catch (err) {
      console.error("Error saving listing:", err);
    } finally {
      setLoading(false);
    }
  };

  const propertySpecs = () => (
    <div className="form-group">
      <h3>Property Specifications</h3>
      <div className="specs-grid">
        <div className="form-group">
          <label>Bedrooms</label>
          <input
            type="number"
            name="bedrooms"
            value={formData.specifications.bedrooms || ""}
            onChange={handleSpecChange}
          />
        </div>
        <div className="form-group">
          <label>Bathrooms</label>
          <input
            type="number"
            name="bathrooms"
            value={formData.specifications.bathrooms || ""}
            onChange={handleSpecChange}
          />
        </div>
        <div className="form-group">
          <label>Area (sqm)</label>
          <input
            type="number"
            name="area"
            value={formData.specifications.area || ""}
            onChange={handleSpecChange}
          />
        </div>
      </div>
    </div>
  );

  const materialSpecs = () => (
    <div className="form-group">
      <h3>Material Specifications</h3>
      <div className="specs-grid">
        <div className="form-group">
          <label>Brand</label>
          <input
            type="text"
            name="brand"
            value={formData.specifications.brand || ""}
            onChange={handleSpecChange}
          />
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.specifications.quantity || ""}
            onChange={handleSpecChange}
          />
        </div>
        <div className="form-group">
          <label>Unit</label>
          <input
            type="text"
            name="unit"
            placeholder="e.g., bags, pieces"
            value={formData.specifications.unit || ""}
            onChange={handleSpecChange}
          />
        </div>
      </div>
    </div>
  );

  const labourSpecs = () => (
    <div className="form-group">
      <h3>Service Specifications</h3>
      <div className="specs-grid">
        <div className="form-group">
          <label>Experience</label>
          <input
            type="text"
            name="experience"
            placeholder="e.g., 5 years"
            value={formData.specifications.experience || ""}
            onChange={handleSpecChange}
          />
        </div>
        <div className="form-group">
          <label>Skills</label>
          <input
            type="text"
            name="skills"
            placeholder="e.g., plumbing, electrical"
            value={formData.specifications.skills || ""}
            onChange={handleSpecChange}
          />
        </div>
        <div className="form-group">
          <label>Availability</label>
          <input
            type="text"
            name="availability"
            placeholder="e.g., weekdays, weekends"
            value={formData.specifications.availability || ""}
            onChange={handleSpecChange}
          />
        </div>
      </div>
    </div>
  );

  const renderSpecifications = () => {
    switch (formData.category) {
      case "property": return propertySpecs();
      case "materials": return materialSpecs();
      case "labour": return labourSpecs();
      default: return null;
    }
  };

  return (
    <div className="add-edit-listing-overlay">
      <div className="add-edit-listing">
        <div className="form-header">
          <h2>{listing ? "Edit Listing" : "Create New Listing"}</h2>
          <button className="close-btn" onClick={onCancel}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="form-steps">
          <div className={`step ${step === 1 ? 'active' : ''}`}>
            <span>1</span>
            <label>Basic Info</label>
          </div>
          <div className={`step ${step === 2 ? 'active' : ''}`}>
            <span>2</span>
            <label>Details</label>
          </div>
          <div className={`step ${step === 3 ? 'active' : ''}`}>
            <span>3</span>
            <label>Media & Contact</label>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="form-step">
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="property">Property</option>
                  <option value="materials">Materials</option>
                  <option value="labour">Labour & Services</option>
                </select>
              </div>

              <div className="form-group">
                <label>Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  {formData.category === "property" && (
                    <>
                      <option value="house">House</option>
                      <option value="apartment">Apartment</option>
                      <option value="land">Land</option>
                      <option value="commercial">Commercial</option>
                    </>
                  )}
                  {formData.category === "materials" && (
                    <>
                      <option value="cement">Cement</option>
                      <option value="roofing">Roofing</option>
                      <option value="tiles">Tiles</option>
                      <option value="doors">Doors</option>
                      <option value="windows">Windows</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="electrical">Electrical</option>
                    </>
                  )}
                  {formData.category === "labour" && (
                    <>
                      <option value="mason">Mason</option>
                      <option value="carpenter">Carpenter</option>
                      <option value="electrician">Electrician</option>
                      <option value="plumber">Plumber</option>
                      <option value="painter">Painter</option>
                      <option value="tiler">Tiler</option>
                      <option value="welder">Welder</option>
                    </>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="form-nav">
                <button type="button" onClick={() => setStep(2)} className="btn btn-primary">
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <div className="form-group">
                <label>Price (₦)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {renderSpecifications()}

              <div className="form-nav">
                <button type="button" onClick={() => setStep(1)} className="btn btn-outline">
                  Back
                </button>
                <button type="button" onClick={() => setStep(3)} className="btn btn-primary">
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-step">
              <div className="form-group">
                <label>Photos/Videos</label>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleMediaChange}
                />
                <div className="file-hint">Upload up to 10 photos or videos</div>
              </div>

              <div className="form-group">
                <h3>Contact Information</h3>
                <div className="specs-grid">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.contactInfo.phone}
                      onChange={handleContactChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.contactInfo.email}
                      onChange={handleContactChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.contactInfo.address}
                      onChange={handleContactChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-nav">
                <button type="button" onClick={() => setStep(2)} className="btn btn-outline">
                  Back
                </button>
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? "Saving..." : (listing ? "Update Listing" : "Create Listing")}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}