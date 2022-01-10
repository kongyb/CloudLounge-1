import React, { useState, useRef } from 'react'
import './Report.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Report = () => {
  const inputContent = useRef()
  const [radioBoxId, setRadioBoxId] = useState(-1)
  const [contents, setContents] = useState('')
  const navigate = useNavigate()

  const contentChange = (e) => {
    setContents(e.target.value)
  }

  const submitBtnClick = () => {
    if (radioBoxId === 3 && contents === '') {
      alert('불편한 사항을 작성해 주세요')
    } else {
      axios({
        method: 'POST',
        url: `${process.env.REACT_APP_SERVER_URL}/lounge/report`,
        data: {
          loungeId: localStorage.getItem('loungeId'),
          radioBoxId: radioBoxId,
          contents: contents,
        },
        headers: { authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      })
        .then((res) => {
          if (res.status === 200) {
            alert('신고가 접수되었습니다.')
            navigate('/')
          }
        })
        .catch((err) => {
          alert('error')
        })
    }
  }

  return (
    <div className="report">
      <div className="reportHeader">어떤 불편함이 있으신가요?</div>
      <div className="reportSurvey">
        <div>
          <div
            className={radioBoxId === 1 ? 'radioOption selected' : 'radioOption'}
            onClick={() => {
              inputContent.current.value = ''
              setRadioBoxId(1)
              setContents(null)
            }}
          >
            흡연장이 없습니다.
          </div>
          <div
            className={radioBoxId === 2 ? 'radioOption selected' : 'radioOption'}
            onClick={() => {
              inputContent.current.value = ''
              setRadioBoxId(2)
              setContents(null)
            }}
          >
            시설이 불청결합니다.
          </div>
          <div
            className={radioBoxId === 3 ? 'radioOption selected' : 'radioOption'}
            onClick={() => {
              setRadioBoxId(3)
              setContents('')
            }}
          >
            기타
          </div>
        </div>
        <textarea
          className="reportContents"
          disabled={radioBoxId !== 3}
          onChange={contentChange}
          ref={inputContent}
          placeholder="불편한 점을 적어주세요"
        ></textarea>
      </div>
      <button className="submitReport" onClick={submitBtnClick}>
        신고제출
      </button>
    </div>
  )
}

export default Report
