import React from 'react';

const BlogFeaturedImage = (props) => {
    if (!props.img) { // if there is no image included in a blog post, return nothing
        return null;
    }

    return (
        <div className="featured-image-wrapper">
            <img src={props.img}/>
        </div>
    )
}

export default BlogFeaturedImage;