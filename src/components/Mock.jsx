import React, { useState } from 'react';
import axios from 'axios';
import { useQueries } from '@tanstack/react-query';

// mock data 조회 가능한 부분 실현시킬려고한다면
// 우선, artist, track을 조회해야함
export default function Mock() {
  const [inputValue, setInputValue] =useState('');

  const HandleChange = (val) => {
    // console.log(val)
    setInputValue(val);
  }
  // val에 e.target.value 받아오는 것 확인

  const instance = axios.create({
    baseURL : 'https://ws.audioscrobbler.com/2.0/',
    params : {
      api_key : process.env.REACT_APP_KEY,
    }
  })
  const queries = useQueries({
    queries : [
      {
        queryKey : ['artist', inputValue],
        queryFn : () => instance.get(null, {
          params : {
            method : 'artist.search',
            artist : inputValue,
            format : 'json',
          }
        }),
        retry : 2,
        staleTime : 1000 * 60 * 30,
      },
      {
        queryKey : ['track', inputValue],
        queryFn : () => instance.get(null, {
          params : {
            method : 'track.getsimilar',
            track : inputValue,
            format : 'json',
          }
        }),
        retry : 2,
        staleTime : 1000 * 60 * 30,
      }
    ]
  })

  // 값이 출력이되는데 이 api의 경우 가수이름, 음악이름이 youtube에서 가져오는지 좀 더러운 값들 출력되는듯

  if (queries.isLoading) {<div>로딩중...🥱</div>}

  console.log(queries[0].data.data, queries[1].data.data)

  return (
    <div style={{ display: 'grid', gridTemplateColumns : 'repeat(2, 1fr)'}}>
      
      <form>
        <input type='text' onChange={(e) => HandleChange(e.target.value)} style={{ width : '20rem', outline: 'none', border: '2px solid black', height: '1.6rem', margin: '1rem 3rem'}}/>
        <div>

        </div>
      </form>
      
      <div style={{ backgroundColor : '#ffbe0b', width: '30rem', height: '30rem', borderRadius: '20px', margin: '1rem auto'}}>

      </div>
      
    </div>
  );
}