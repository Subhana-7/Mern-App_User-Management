import React,{useEffect, useRef, useState} from 'react'
import { useSelector } from 'react-redux'
import {ToastContainer,toast} from 'react-toastify'

const Profile = () => {

  const fileRef = useRef(null);
  const {currentUser} = useSelector((state) => state.user);
  const [image,setImage] = useState(undefined);
  const [imageError,setImageError] = useState(false);
  const [formData,setFormData] = useState({});

  useEffect(() => {
    if(image) {
      handleFileUpload(image);
    }
  },[image])

  const handleFileUpload = async(file) => {
    console.log("Cloudinary Upload URL:", import.meta.env.VITE_CLOUDINARY_UPLOAD_URL);
    const formData = new FormData();
    formData.append("file",file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    formData.append("cloud_name",import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    try{
      const response = await fetch(import.meta.env.VITE_CLOUDINARY_UPLOAD_URL,{
        method:"POST",
        body:formData,
      });
      const data = await response.json();
      if(data.secure_url){
        setFormData((prev) => ({...prev, profilePicture: data.secure_url}));
        setImageError(false);
        toast.success("Profile picture uploaded successfully!")
      }
    }catch(error){
      console.error(error);
      setImageError(true);
      toast.error("Failed to upload profile picture");
    }
  }

  

  return (
    <div className='p-3 max-w-lg mx-auto' >

      <ToastContainer
        position='top-right' autoClose={3000} theme='colored' hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover/>

      <h1 className='text-3xl font-bold text-center my-7' >Profile</h1>

      <form className='flex flex-col gap-6' >

        <input type="file"  ref={fileRef} hidden accept='image/*'  onChange={(e) =>setImage( e.target.files[0])}/>

        <img src={formData.profilePicture || currentUser.profilePicture} alt="profile" className='h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2' onClick={() => fileRef.current.click()} />

        {/* <p>{imageError ? (
          <span className='text-red-700' >
            Error uploading image
          </span> 
        ):(
          <span className='text-slate-700' >Uploading image..</span>
        ) }</p> */}

        <input defaultValue={currentUser.username} type="text" id="username" placeholder='Username' className='bg-slate-100 rounded-lg p-3'/>

        <input defaultValue={currentUser.email} type="email" id="email" placeholder='Email' className='bg-slate-100 rounded-lg p-3'/>

        <input type="password" id="password" placeholder='Password' className='bg-slate-100 rounded-lg p-3'/>

        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80' >
          Update
        </button>

        <div className='flex justify-between mt-5' >
          <span className='text-red-700 cursor-pointer' >Delete Account</span>
          <span className='text-red-700 cursor-pointer' >Sign out</span>
        </div>
      </form>
    </div>
  )
}

export default Profile
