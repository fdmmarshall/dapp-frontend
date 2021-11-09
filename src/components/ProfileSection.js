import React from 'react';

const profile = () => {
  return (
    <div className='flex flex-row'>
      {' '}
      <img
        className='inline-block h-32 w-32 rounded-full'
        src={require('../images/HI-RES-CARTOON_transparent_bg.png')}
        alt=''
      />
    </div>
  );
};

export default profile;
