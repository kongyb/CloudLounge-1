import React, { useState, useEffect } from 'react'
import logo from './logo.png'
import nLogo from './nLogo.png'
import kLogo from './kLogo.png'
import './Login.css'
import { useSelector, useDispatch } from 'react-redux'
import {
  handleAdminTrue,
  handleLoginTrue,
  notificationOn,
  setNotification,
} from '../../actions/index'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
axios.defaults.withCredentials = true

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [start, setStart] = useState(false)
  const isNotification = useSelector((state) => state.isNotificationReducer)
  const handleClick = async () => {
    if (isNotification) {
      return
    }
    await axios
      .post(process.env.REACT_APP_SERVER_URL + '/user/login', {
        email: id,
        password: pw,
      })
      .then((res) => {
        if (res.data.data.accessToken) {
          window.localStorage.setItem('accessToken', res.data.data.accessToken)
          dispatch(handleLoginTrue())
          if (!res.data.data.admin) {
            navigate('/mypage')
          } else {
            window.localStorage.setItem('admin', res.data.data.admin)
            dispatch(handleAdminTrue())
            navigate('/admin')
          }
        }
      })
      .catch((err) => {
        dispatch(notificationOn())
        dispatch(
          setNotification('[로그인 실패] 아이디 혹은 비밀번호를 다시 확인해주세요')
        )
      })
  }

  const [id, setId] = useState('')
  const [pw, setPw] = useState('')

  const handleChange = (e) => {
    if (e.target.name === 'id') {
      setId(e.target.value)
    }
    if (e.target.name === 'pw') {
      setPw(e.target.value)
    }
  }

  const oauthUrls = {
    naver: process.env.REACT_APP_OAUTH_NAVER,
    kakao: process.env.REACT_APP_OAUTH_KAKAO,
  }

  const handleSignupClick = () => {
    navigate('/signup')
  }

  useEffect(() => {
    const url = new URL(window.location.href)
    const authorizationCode = url.searchParams.get('code')
    const authorizationState = url.searchParams.get('state')
    if (authorizationCode) {
      if (authorizationState) {
        //스테이트 있으면 네이버로그인
        axios
          .post(process.env.REACT_APP_SERVER_URL + '/oauth/naverCallback', {
            authorizationCode,
            authorizationState,
          })
          .then((res) => {
            const { accessToken, oauth } = res.data.data
            window.localStorage.setItem('accessToken', accessToken)
            window.localStorage.setItem('oauth', oauth)
            dispatch(handleLoginTrue())
            navigate('/mypage')
          })
      } else {
        //스테이트 없으면 카카오로그인
        axios
          .post(process.env.REACT_APP_SERVER_URL + '/oauth/kakaoCallback', {
            authorizationCode,
          })
          .then((res) => {
            const { accessToken, oauth } = res.data.data
            window.localStorage.setItem('accessToken', accessToken)
            window.localStorage.setItem('oauth', oauth)
            dispatch(handleLoginTrue())
            navigate('/mypage')
          })
      }
    }
  }, [window.location.href])

  return (
    <div className="login-page-wrapper">
      <div id="logo">
        <img src={logo} alt="Logo" className="logo-wrapper" />
      </div>
      <div className="login-part">
        <div className="login-top">
          <div className="inputs-wrapper">
            <div className="idpw-box-id">
              <div className="idpw-indicator">아이디</div>
              <input
                type="text"
                name="id"
                placeholder="이메일 아이디를 입력하세요"
                onChange={handleChange}
                className="login-input"
                spellCheck="false"
              ></input>
            </div>
            <div className="idpw-box-pw">
              <div className="idpw-indicator">비밀번호</div>
              <input
                type="password"
                name="pw"
                placeholder="비밀번호를 입력하세요"
                spellCheck="false"
                onChange={handleChange}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleClick()
                  }
                }}
                className="login-input"
              ></input>
            </div>
          </div>
          <button className="loginBtn" onClick={handleClick}>
            로그인
          </button>
          <button className="loginBtn" onClick={handleSignupClick}>
            회원가입
          </button>
        </div>
        <div className="social-login">
          <a className="loginMenu" href={oauthUrls.naver}>
            <img src={nLogo} id="nLogo"></img>
          </a>
          <a className="loginMenu" href={oauthUrls.kakao}>
            <img src={kLogo} id="kLogo"></img>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Login
