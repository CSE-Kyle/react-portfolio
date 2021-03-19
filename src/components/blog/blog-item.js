import React from 'react';
import {Link} from "react-router-dom";
import striptags from 'striptags';
import Truncate from 'react-truncate';

const BlogItem = (props) => { // passing in props to know title value, content value, etc.
    const { // destructuring
        id, 
        blog_status, 
        content, 
        title,
        featured_image_url
    } = props.blogItem; 

    return (
      <div>
        <Link to={`/b/${id}`}> {/* giving access to /b/ link with id */}
          <h1>{title}</h1>
        </Link>

        <div>
          <Truncate 
            lines={5}
            ellipsis={
              <span>
                ...<Link to={`/b/${id}`}>Read more</Link>
              </span>
            }
          >
            {striptags(content)} {/* removing any kinds of tags within the content; allowing everything except scripts */}
          </Truncate>
        </div>
      </div>
    );
}

export default BlogItem;