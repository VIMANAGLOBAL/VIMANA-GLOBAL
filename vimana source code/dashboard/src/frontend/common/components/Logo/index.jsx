import React from 'react';
import style from './style.scss';

import { Link } from 'react-router-dom';

const Logo = () => (
    <div className={style.wrapper}>
        <Link to="/dashboard">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                viewBox="75 0 15 18"
            >
                <path
                    fillRule="evenodd"
                    fill="rgb(255, 255, 255)"
                    d="M159.435,3.499 L159.435,1.508 C159.435,1.451 159.436,1.371 159.437,1.268 C159.439,1.164 159.439,1.085 159.439,1.029 L158.889,3.499 L158.298,3.499 L157.752,1.029 C157.752,1.085 157.752,1.164 157.754,1.268 C157.755,1.371 157.756,1.451 157.756,1.508 L157.756,3.499 L157.190,3.499 L157.190,0.556 L158.073,0.556 L158.602,2.870 L159.128,0.556 L160.001,0.556 L160.001,3.499 L159.435,3.499 ZM156.137,3.499 L155.526,3.499 L155.526,1.077 L154.652,1.077 L154.652,0.556 L157.006,0.556 L157.006,1.077 L156.137,1.077 L156.137,3.499 ZM151.066,17.002 C148.719,17.002 146.768,15.846 145.634,13.917 L141.416,6.737 L137.196,13.917 C136.063,15.847 134.112,17.002 131.764,17.002 L128.180,17.002 L135.996,3.642 L130.640,0.576 L141.416,0.578 C143.708,0.578 145.749,1.787 146.842,3.655 L154.652,17.002 L151.066,17.002 ZM115.004,13.925 L110.254,6.737 L109.754,6.737 L109.754,17.003 L103.228,17.003 L103.228,0.578 L109.352,0.578 C111.734,0.578 113.560,1.614 114.759,3.656 L118.957,10.799 L119.483,10.799 L119.483,0.578 L126.009,0.578 L126.009,17.003 L119.885,17.003 C117.503,17.003 116.309,15.901 115.004,13.925 ZM92.709,13.917 L88.489,6.737 L84.271,13.917 C83.138,15.846 81.187,17.002 78.839,17.002 L75.254,17.002 L83.071,3.642 L77.715,0.576 L88.489,0.578 C90.726,0.578 92.791,1.739 93.917,3.655 L99.950,13.923 L101.728,17.002 L98.140,17.002 C95.793,17.002 93.842,15.847 92.709,13.917 ZM66.533,6.737 L66.033,6.737 L60.001,17.003 L56.071,17.003 L50.050,6.737 L49.539,6.737 L49.539,17.003 L43.013,17.003 L43.013,0.578 L49.121,0.578 C51.381,0.578 53.423,1.734 54.543,3.652 L58.036,9.634 L61.529,3.652 C62.650,1.734 64.690,0.578 66.951,0.578 L73.059,0.578 L73.059,17.003 L66.533,17.003 L66.533,6.737 ZM32.095,7.347 C32.095,4.983 33.131,3.162 35.204,1.970 L38.621,0.003 L38.621,17.003 L32.095,17.003 L32.095,7.347 ZM17.922,17.003 C15.629,17.003 13.587,15.795 12.496,13.926 L7.061,4.620 L-0.002,0.576 L8.049,0.578 C10.482,0.578 12.458,1.544 13.704,3.664 L17.922,10.844 L22.142,3.664 C23.275,1.734 25.225,0.571 27.573,0.578 L31.126,0.588 L23.350,13.926 C22.259,15.795 20.215,17.003 17.922,17.003 Z"
                />
            </svg>
        </Link>
    </div>
    );

export default Logo;
