import { gql, useQuery } from "@apollo/client"
import { useParams } from "react-router-dom";

const GET_MOVIE = gql`
    query getMovie($movieId: String!) {
        movie(id: $movieId) {
            id
            title
            rating
            medium_cover_image
            isLiked @client
        }
    }
`

export default function Movie() {
    const { id } = useParams();

    const { data, loading, client: {cache} } = useQuery(GET_MOVIE, {
        variables: {
            movieId: id,
        }
    })

    if(loading) {
        return <h1> Loading... </h1>
    }

     const onClick = () => {
        cache.writeFragment({
            id: `Movie:${id}`,

            fragment: gql`
                fragment MovieFragment on Movie {
                    isLiked
                }
            `,

            data: {
                isLiked: !data.movie.isLiked,
            },
        }) 
    }

    return (
    <div>
        {data.movie.title}  /  ★ {data.movie.rating}
        <div>
            <img src={data.movie.medium_cover_image}></img>
        </div>
        <div>
            <button onClike={onClick}>{data.movie.isLiked ? "Unlike" : "Like"}</button>
        </div>
    </div>
    )
}
