import { Component } from 'substance'
const userRoles = ['admin', 'volunteer', 'respondent']

class UserForm extends Component {

  render($$) {
    const Button = this.getComponent('button')
    const Input = this.getComponent('input')

    let el = $$('div').addClass('sc-user-form')

    let emailInput = $$('div').addClass('se-email').append(
      $$(Input, {
        type: 'email',
        placeholder: this.getLabel('enter-email'),
        centered: true
      }).ref('email')
    )

    if(this.state.error) {
      emailInput.append(
        $$('div').addClass('se-error').append('Please enter valid email')
      )
    }

    let roleSelect = $$('select').addClass('se-select').append(
        $$('option').append(this.getLabel('role-default-value'))
      ).ref('role')

    userRoles.forEach(roleId => {
      let option = $$('option').attr({value: roleId}).append(this.getLabel('role-' + roleId))
      roleSelect.append(option)
    })

    let roleInput = $$('div').addClass('se-dropdown').append(roleSelect)

    let accessInput = $$('label').addClass('se-checkbox').append(
      $$(Input, {
        type: 'checkbox'
      }).ref('access'),
      $$('div').addClass('se-label').append(this.getLabel('grant-access'))
    )

    let superInput = $$('label').addClass('se-checkbox').append(
      $$(Input, {
        type: 'checkbox'
      }).ref('super'),
      $$('div').addClass('se-label').append(this.getLabel('grant-super-access'))
    )

    let actions = $$('div').addClass('se-actions').append(
      $$(Button, {label: 'invite-label', theme: 'round'}).addClass('se-invite-user')
        .on('click', this._createUser),
      $$(Button, {label: 'cancel-label', theme: 'round'}).addClass('se-cancel')
        .on('click', this.send.bind(this, 'closeModal'))
    )

    el.append(
      emailInput,
      roleInput,
      accessInput,
      superInput,
      actions
    )

    return el
  }

  _createUser() {
    let newUser = {
      email: this.refs.email.val(),
      role: this.refs.role.val()
    }

    newUser.access = this.refs.access.el.el.checked;
    newUser.super = this.refs.super.el.el.checked;

    let emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (emailRegExp.test(newUser.email)) {
      this.send('createUser', newUser);
    } else {
      this.setState({'error': true});
    }
  }
}

export default UserForm
