import React, { useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { History, LocationState } from "history";
import logo from '../assets/Pareto_Lockup-White.png';
import { I18n } from '@aws-amplify/core';
import Button from 'react-bootstrap/lib/Button';
import marketing from '../assets/marketing.png';
import propTypes from 'prop-types';

/**
 * This is the Landing page component, that has the testimonials from members of our community.
 */

interface HistoryProps {
  history: History<LocationState>;
}

function Landing<RouteComponentProps>(props: HistoryProps) {
  const [testimonials, setTestimonials] = useState([
    {
      name: 'Leonard Ugorji',
      title: 'UX and Coding Designer',
      img: 'https://res.cloudinary.com/leonuch/image/upload/v1566585511/IMG_20190517_121637_1_wqcwyd.jpg',
      words: 'Great OS project lot to learn here',
    },
  ]);

  return (
    <div>
      <div className='top-nav'>
        <img
          src={logo}
          alt='Pareto'
          height='40'
          width='178'
          style={{ marginTop: 10, marginLeft: 12 }}
        />
        <Link
          to='/login'
          style={{ color: 'white', marginTop: 18, marginRight: 18 }}
        >
          {I18n.get('login')}
        </Link>
      </div>
      <div style={{ marginTop: 65, paddingLeft: 40, paddingRight: 40 }}>
        <h1 className='text-center'>{I18n.get('firstLanding')}</h1>
        <p className='text-center'>{I18n.get('secondLanding')}</p>
        <p className='text-center'>{I18n.get('thirdLanding')}</p>
        <br />
        <div style={{ textAlign: 'center' }}>
          <Button onClick={() => props.history.push('/signup')}>
            {I18n.get('signup')}
          </Button>
          <Button
            className='btn-outline'
            onClick={() => props.history.push('/login')}
          >
            {I18n.get('login')}
          </Button>
        </div>
        <br />
        <div className='flex-center'>
          <img
            src={marketing}
            style={{ width: '100%', height: 'auto' }}
            alt='Screenshot of the learning system'
          />
        </div>
        <br />
        <br />
        {/* <h2 className="text-center">{I18n.get("landingText")}</h2> */}
        <div className='context-cards'>
          {testimonials.map((test, i) => {
            return (
              <div className='context-card' key={i}>
                <p className='text-center' style={{ fontWeight: 'bold' }}>
                  {test.words}
                </p>
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <img
                    src={test.img}
                    height='60'
                    width='60'
                    alt={test.name}
                    style={{ borderRadius: '50%' }}
                  />
                </div>
                <h3
                  className='text-center'
                  style={{ color: 'rgb(37, 38, 39)', fontWeight: 'bolder' }}
                >
                  {test.name}
                </h3>
                <p className='text-center' style={{ color: 'rgb(37, 38, 39)' }}>
                  {test.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Landing.propTypes = {
  name: propTypes.string,
  title: propTypes.string,
  img: propTypes.any,
  words: propTypes.string,
};

export default Landing;
