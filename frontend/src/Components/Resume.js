import React from 'react';
import { Document, Page  } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";



class Resume extends React.Component {


    constructor(props)
    {
        super(props);

        this.state = {
            numPages: null,
            pageNumber: 1,
            loaded: false,
        };
    }

    componentDidMount(){

        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    }

    render(){

        const {pageNumber} = this.state;

        return (
        <Box width="auto" marginLeft="auto" marginRight="auto" minHeight="100vh" mb="5vh">
            <Paper>
                <Document
                    file="/images/ResumeJacobToomey.pdf"
                    onLoadSuccess={({pages}) => this.setState({numPages: pages, loaded: true})}
                > 
                    <Page pageNumber={pageNumber} />
                </Document>
            </Paper>
        </Box>
        );
     }
}

export default React.forwardRef((props, ref) => <Resume {...props} innerRef={ref} />)