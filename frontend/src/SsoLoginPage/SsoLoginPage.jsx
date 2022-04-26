import React from 'react';
import { authenticationService } from '@/_services';
import { Spinner, Alert } from 'react-bootstrap';
class SsoLoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      message: null,
      success: false,
    };
  }

  componentDidMount() {
    authenticationService.ssoLogin().then((data) => {
      if (data.status) {
        this.setState({
          isLoading: false,
          success: true,
          message: 'Authenticated , Please wait redirecting to dashboard',
        });
        setTimeout(() => {
          document.location.href = '/';
        }, 1500);
      } else {
        this.setState({
          isLoading: false,
          success: false,
          message: data.message,
        });
      }
    });
  }

  render() {
    return (
      <div className="page page-center">
        <div className="container-tight py-2 text-center">
          {!this.state.message ? (
            <>
              <Spinner
                animation="border"
                role="status"
                variant="info"
                style={{
                  width: '3rem',
                  height: '3rem',
                }}
              >
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <h2 className="mt-2">Authenticating Please wait..</h2>
            </>
          ) : (
            <>
              <Alert variant={this.state.success ? 'success' : 'danger'}>{this.state.message}</Alert>
            </>
          )}
        </div>
      </div>
    );
  }
}

export { SsoLoginPage };
