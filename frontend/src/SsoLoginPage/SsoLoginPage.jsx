import React from 'react';
import { authenticationService } from '@/_services';

class SsoLoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      token: '',
      email: '',
      password: '',
    };
  }

  componentDidMount() {
    authenticationService.ssoLogin().then((data) => {
      if (data.status) {
        document.location.href = '/';
      } else {
        alert(data.message);
      }
      console.log('Sso Login', data);
    });
  }

  render() {
    return (
      <div className="page page-center">
        <div className="container-tight py-2">
          <div className="text-center mb-4">PleaseWait Checking Auth</div>
        </div>
      </div>
    );
  }
}

export { SsoLoginPage };
