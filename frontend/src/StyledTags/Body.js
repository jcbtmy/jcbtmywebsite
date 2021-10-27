
import Typography  from "@material-ui/core/Typography";
import grey from "@material-ui/core/colors/grey";


export default function Body(props)
{
    return (
        <Typography
            variant="body2"
            style={{color: grey[700]}}
        >
            {props.children}
        </Typography>
    )
}