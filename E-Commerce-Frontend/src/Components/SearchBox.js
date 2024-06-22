// import React, { useState } from 'react'
// import { Button, Form } from 'react-bootstrap'
// import { useHistory } from 'react-router-dom'

// function SearchBox() {
//     const [keyword, setKeyword] = useState('')

//     let history = useHistory()

//     const submitHandler = (e) => {
//         e.preventDefault()
//         if (keyword) {
//             history.push(`/?keyword=${keyword}&page=1`)
//         } else {
//             history.push(history.push(history.location.pathname))
//         }
//     }
//     return (
//         <Form onSubmit={submitHandler} inline>
//             <Form.Control
//                 type='text'
//                 name='q'
//                 onChange={(e) => setKeyword(e.target.value)}
//                 className='mr-sm-2 ml-sm-5'
//             ></Form.Control>

//             <Button
//                 type='submit'
//                 variant='outline-success'
//                 className='p-2'
//             >
//                 Submit
//             </Button>
//         </Form>
//     )
// }

// export default SearchBox


import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

function SearchBox() {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword) {
            navigate(`/?keyword=${keyword}&page=1`);
            setKeyword('')
            
        } else {
            navigate(location.pathname);
        }
        
    };

    // const submitHandler = (e) => {
    //     e.preventDefault();
    //     if (keyword) {
    //         navigate({
    //             pathname: '/',
    //             search: `?keyword=${keyword}&page=1`
    //         });
    //     } else {
    //         navigate(location.pathname);
    //     }
    // };
    

    return (
        <Form onSubmit={submitHandler} inline>
            <div className="d-flex"> 
                <Form.Control
                    type='text'
                    name='q'
                    onChange={(e) => setKeyword(e.target.value)}
                    value={keyword}
                    className='mr-sm-2 ml-sm-5'
                />

                <Button
                    type='submit'
                    variant='outline-success'
                    className='p-2 mx-3'
                >
                    Submit
                </Button>
            </div>
        </Form>
    );
}

export default SearchBox;

