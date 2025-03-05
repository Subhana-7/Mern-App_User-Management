import React,{useEffect, useRef, useState} from 'react'
import { useSelector } from 'react-redux'
import {ToastContainer,toast} from 'react-toastify'
import { useDispatch } from 'react-redux'
import {updateUserStart,updateUserSuccess,updateUserFailure} from '../redux/user/userSlice'

const Profile = () => {

  const fileRef = useRef(null);
  const {currentUser,loading,error} = useSelector((state) => state.user);
  const [image,setImage] = useState(undefined);
  const [imageError,setImageError] = useState(false);
  const [formData,setFormData] = useState({});
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if(image) {
      handleFileUpload(image);
    }
  },[image])

  const handleFileUpload = async(file) => {
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };


  const handleSubmit = async(e) =>{
    e.preventDefault();
    try{
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method:"POST",
        headers:{
          'Content-type':'application/json'
        },
        body:JSON.stringify(formData),
      })
      const data = await res.json();
      if(data.success === false) {
        dispatch(updateUserFailure(data));
        toast.error(data.message || "Update failed");
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      toast.success("User updated successfully!");
    }catch(error) {
      dispatch(updateUserFailure(error));
      toast.error("Something went wrong!")
    }
  }

  

  return (
    <div className='p-3 max-w-lg mx-auto' >

      <ToastContainer
        position='top-right' autoClose={3000} theme='colored' hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover/>

      <h1 className='text-3xl font-bold text-center my-7' >Profile</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-6' >

        <input type="file"  ref={fileRef} hidden accept='image/*'  onChange={(e) =>setImage( e.target.files[0])}/>

        <img src={formData.profilePicture || currentUser.profilePicture} alt="profile" className='h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2' onClick={() => fileRef.current.click()} />

        <input defaultValue={currentUser.username} type="text" id="username" placeholder='Username' className='bg-slate-100 rounded-lg p-3' onChange={handleChange} />

        <input defaultValue={currentUser.email} type="email" id="email" placeholder='Email' className='bg-slate-100 rounded-lg p-3' onChange={handleChange} />

        <input type="password" id="password" placeholder='Password' className='bg-slate-100 rounded-lg p-3' onChange={handleChange} />

        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80' >
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
        <div className='flex justify-between mt-5' >
          <span className='text-red-700 cursor-pointer' >Delete Account</span>
          <span className='text-red-700 cursor-pointer' >Sign out</span>
        </div>

      <p className='text-red-700 mt-5' >{error && 'Something went wrong!'}</p>
      <p className='text-green-700 mt-5' >{error && 'User is updated Successfully!'}</p>
      
    </div>
  )
}

export default Profile
