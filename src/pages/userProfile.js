import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

import { detailsUser, updateUserProfile } from '../redux/actions/userAction';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserProfile = () => {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [matchedPassword, setMatchedPassword] = useState(true);
  const [image, setImage] = useState('');
  const navigate = useNavigate();

  const myInfo = useSelector(state => state.userSignin);
  const { userInfo } = myInfo;
  const userDetail = useSelector(state => state.userDetail);
  const { loading, error, user } = userDetail;
  const dispatch = useDispatch()

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const {
    error: errorUpdate,
    loading: loadingUpdate,
  } = userUpdateProfile;

  useEffect(() => {

    if (!userInfo) {
      navigate('/login')
    } else {
      if (userInfo && userInfo.role === 'admin') {
        navigate('/admin')
      }
      else if (!user) {
        dispatch(detailsUser(userInfo._id));
      } else {
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
        setPhone(user.phone);
        setAddress(user.address);
        setImage(user.avatar);
      }
    }

    // }
  }, [dispatch, userInfo, user])

  const handleSubmit = (e) => {
    e.preventDefault();
    // dispatch update profile

    if (password !== confirmPassword) {
      setMatchedPassword(false);
    } else {
      setMatchedPassword(true);
      dispatch(
        updateUserProfile({
          _id: user._id,
          firstName,
          lastName,
          email,
          password,
          address,
          phone,
          avatar: image,
        })
      );
    }
  }

  const uploadImage = (e) => {
    const cloundName = 'dl02ow13v';
    const uploadPreset = 'oj8a39rm';
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("upload_preset", uploadPreset);


    axios.post(`https://api.cloudinary.com/v1_1/${cloundName}/upload`, formData)
      .then(res => {
        setImage(res.data.url)

      }).catch(error =>
        console.log(error)
      )
  }

  return (
    <div>
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
      />
      <h2 className="page-header">T??i kho???n c???a t??i</h2>
      <div className="row">
        <div className="col-4 col-md-12 col-sm-12">
          <div className="card full-height">
            {
              loading ? <div>Loading...</div> : error ? <div>{error}</div>
                : <div>
                  <div className="userShowTop">
                    <img
                      src={(user && user.avatar) || ''}
                      alt=""
                      className="userShowImg"
                    />
                    <div className="userShowTopTitle">
                      <span className="userShowUsername">{(user && user.name) || ''}</span>
                      <span className="userShowUserTitle">Lo???i TK: {(user && user.role) || ''}</span>
                    </div>
                  </div>
                  <div className="userShowBottom">
                    <span className="userShowTitle">Th??ng tin t??i kho???ns</span>
                    <div className="userShowInfo">
                      <i className="bx bx-user bx-sm userUpdateIcon"></i>
                      <span className="userShowInfoTitle">{(user && (user.lastName + ' ' + user.firstName)) || ''}</span>
                    </div>

                    <span className="userShowTitle">Th??ng tin li??n h???</span>
                    <div className="userShowInfo">
                      <i className="bx bx-phone bx-sm userUpdateIcon"></i>
                      <span className="userShowInfoTitle">{(user && user.phone) || ''}</span>
                    </div>
                    <div className="userShowInfo">
                      <i className="bx bx-mail-send bx-sm userUpdateIcon"></i>
                      <span className="userShowInfoTitle">{(user && user.email) || ''}</span>
                    </div>
                    <div className="userShowInfo">
                      <i className="bx bx-map bx-sm userUpdateIcon"></i>
                      <span className="userShowInfoTitle">{(user && user.address) || ''}</span>
                    </div>
                  </div>
                </div>
            }
          </div>
        </div>
        <div className="col-8 col-md-12 col-sm-12">
          <div className="card full-height">
            <form action="" className="userUpdateForm" onSubmit={handleSubmit}>
              <div className="userUpdateLeft">
                <span className="userShowTitle">C???p nh???t th??ng tin</span>
                {loadingUpdate && <div>??ang c???p nh???t...</div>}
                {errorUpdate && <div>{errorUpdate}</div>}

                <div className="userUpdateItem">
                  <label>H??? v?? t??n ?????m</label>
                  <input
                    type="text"
                    placeholder="Ngo Xuan"
                    className="userUpdateInput"
                    onChange={e => setLastName(e.target.value)}
                    value={lastName}
                  />
                  {console.log(lastName)}
                </div>
                <div className="userUpdateItem">
                  <label>T??n</label>
                  <input
                    type="text"
                    placeholder="Thang"
                    className="userUpdateInput"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                  />
                </div>
                <div className="userUpdateItem">
                  <label>S??? ??i???n tho???i</label>
                  <input
                    type="text"
                    placeholder="+01 23456789"
                    className="userUpdateInput"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
                <div className="userUpdateItem">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="mail@gmail.com"
                    className="userUpdateInput"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div className="userUpdateItem">
                  <label>?????a ch???</label>
                  <input
                    type="text"
                    placeholder="?????a ch???"
                    className="userUpdateInput"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                  />
                </div>
              </div>
              <div className="userUpdateLeft">
                <span className="userShowTitle">Thay ?????i m???t kh???u</span>
                <div className="userUpdateItem">
                  <label>Nh???p m???t kh???u</label>
                  <input
                    type="password"
                    placeholder="password"
                    className="userUpdateInput"
                    onChange={e => setPassword(e.target.value)}
                    title="M???t kh???u ph???i ch???a ??t nh???t m???t s??? v?? m???t ch??? c??i vi???t hoa v?? vi???t th?????ng v?? ??t nh???t 8 k?? t??? tr??? l??n"
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  />
                </div>
                <div className="userUpdateItem">
                  <label>X??c th???c m???t kh???u</label>
                  <input
                    type="password"
                    placeholder="password"
                    className="userUpdateInput"
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                  {(!matchedPassword) && <div>M???t kh???u kh??ng kh???p!</div>}
                </div>
              </div>


              <div className="userUpdateRight">
                <div className="userUpdateUpload">
                  <img
                    className="userUpdateImg"
                    src={image}
                    alt=""
                  />
                  <label htmlFor="file">
                    <i className="bx bx-upload bx-sm userUpdateIcon"></i>
                  </label>
                  <input onChange={uploadImage} type="file" id="file" style={{ display: "none" }} />
                </div>
                <button className="userUpdateButton" type='submit'>Update</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
