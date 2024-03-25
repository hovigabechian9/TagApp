import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

function HomePage() {
    return (
        <Container>
             <Row className="px-4 my-5">
                <Col sm={6}>
                    <h1 className="font-weight-light">Tagging App Context</h1>
                    <p className="mt-4">
                        Hovig Abechian
                        <br /><br />
                        A completer Context & Doc
                        bla bla
                    </p>
                    
                        <Button variant="outline-primary">Aide &gt;&gt;</Button>
                    
                </Col>
             </Row>
        </Container>
    )
}

export default HomePage;