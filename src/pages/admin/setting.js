import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { ToastContainer } from 'react-toastify';

import { detailsUser, updateUserProfile } from '../../redux/actions/userAction'

const Setting = ({ history }) => {
    const imageDefault = "https://img.icons8.com/officel/260/000000/person-male.png"
    const myInfo = useSelector(state => state.userSignin);
    const { userInfo } = myInfo;
    const userDetail = useSelector(state => state.userDetail);
    const { loading, error, user } = userDetail;
    const dispatch = useDispatch()

    const [fname, setFname] = useState('')
    const [lname, setLname] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [passwordAgain, setPasswordAgain] = useState('')
    const [address, setAddress] = useState('')
    const [image, setImage] = useState('');
    const [matchedPassword, setMatchedPassword] = useState(true);

    useEffect(() => {

        if (userInfo && userInfo.role === 'admin') {
            if (!user) {
                dispatch(detailsUser(userInfo._id));
            } else {
                setFname(user.firstName);
                setLname(user.lastName);
                setEmail(user.email);
                setImage(user.avatar);
                setAddress(user.address);
                setPhone(user.phone);
                setImage(user.avatar);
            }
        } else {
            history.push('/login')
        }
    }, [dispatch, userInfo, user, history])

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
    const handleSubmit = () => {
        if (password !== passwordAgain) {
            setMatchedPassword(false);
        }
        else {
            setMatchedPassword(true);

            dispatch(updateUserProfile({
                _id: user._id,
                firstName: fname,
                lastName: lname,
                phone,
                email,
                address,
                password,
                avatar: image,
            }))
        }
    }
    return (
        <div>
            <ToastContainer
                position="top-right"
                autoClose={1800}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
            />
            <h2 className="page-header">T??i kho???n c???a t??i</h2>
            <div className="row">
                <div className="col-4">
                    <div className="card full-height">
                        {
                            loading ? <div>Loading...</div> : error ? <div>{error}</div>
                                : <div>
                                    <div className="userShowTop">
                                        <img
                                            src={(user && user.avatar) || ''}
                                            alt="???nh"
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
                                        {/* <div className="userShowInfo">
                                            <i className="bx bx-calendar-alt bx-sm userUpdateIcon"></i>
                                            <span className="userShowInfoTitle">ch??a l??m</span>
                                        </div> */}
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
                <div className="col-8">
                    <div className="card full-height">
                        <form action="" className="userUpdateForm">
                            <div className="userUpdateLeft">
                                <span className="userShowTitle">C???p nh???t th??ng tin</span>
                                <div className="userUpdateItem">
                                    <label>H??? v?? t??n ?????m</label>
                                    <input
                                        type="text"
                                        placeholder="Ngo"
                                        className="userUpdateInput"
                                        value={lname}
                                        onChange={(e) => setLname(e.target.value)}
                                    />
                                </div>
                                <div className="userUpdateItem">
                                    <label>T??n</label>
                                    <input
                                        type="text"
                                        placeholder="Thang"
                                        className="userUpdateInput"
                                        value={fname}
                                        onChange={(e) => setFname(e.target.value)}
                                    />
                                </div>
                                <div className="userUpdateItem">
                                    <label>S??? ??i???n tho???i</label>
                                    <input
                                        type="text"
                                        placeholder="+01 23456789"
                                        className="userUpdateInput"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                <div className="userUpdateItem">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        placeholder="mail@gmail.com"
                                        className="userUpdateInput"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="userUpdateItem">
                                    <label>?????a ch???</label>
                                    <input
                                        type="text"
                                        placeholder="?????a ch???"
                                        className="userUpdateInput"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
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
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="userUpdateItem">
                                    <label>Nh???p l???i m???t kh???u</label>
                                    <input
                                        type="password"
                                        placeholder="password"
                                        className="userUpdateInput"
                                        onChange={(e) => setPasswordAgain(e.target.value)}
                                    />
                                    {/* {!checkPasswordMatch() && <div style={{ color: "red" }}>M???t kh???u kh??ng kh???p</div>} */}
                                    {(!matchedPassword) && <div style={{ color: "red" }}>M???t kh???u kh??ng kh???p!</div>}
                                </div>

                                <div className="userUpdateRight pt-15">
                                    <div className="userUpdateUpload">
                                        <img
                                            className="userUpdateImg"
                                            src={image || imageDefault}
                                            alt=""
                                        />
                                        <label htmlFor="file" >
                                            <i className="bx bx-upload bx-sm userUpdateIcon"></i>
                                        </label>

                                        <input type="file" id="file" style={{ display: "none" }}
                                            onChange={uploadImage}
                                        />

                                        <button className="userUpdateButton mt-15" type="button"
                                            onClick={() => handleSubmit()}
                                        >Update</button>
                                    </div>
                                </div>
                            </div>



                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Setting
