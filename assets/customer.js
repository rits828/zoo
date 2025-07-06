const selectors = {
  customerAddresses: '[data-customer-addresses]',
  addressCountrySelect: '[data-address-country-select]',
  addressContainer: '[data-address]',
  toggleAddressButton: 'button[aria-expanded]',
  cancelAddressButton: 'button[type="reset"]',
  deleteAddressButton: 'button[data-confirm-message]',
};

const attributes = {
  expanded: 'aria-expanded',
  confirmMessage: 'data-confirm-message',
};

class CustomerAddresses {
  constructor() {
    this.elements = this._getElements();
    if (Object.keys(this.elements).length === 0) return;
    this._setupCountries();
    this._setupEventListeners();
  }

  _getElements() {
    const container = document.querySelector(selectors.customerAddresses);
    return container
      ? {
          container,
          addressContainer: container.querySelector(selectors.addressContainer),
          toggleButtons: document.querySelectorAll(selectors.toggleAddressButton),
          cancelButtons: container.querySelectorAll(selectors.cancelAddressButton),
          deleteButtons: container.querySelectorAll(selectors.deleteAddressButton),
          countrySelects: container.querySelectorAll(selectors.addressCountrySelect),
        }
      : {};
  }

  _setupCountries() {
    if (Shopify && Shopify.CountryProvinceSelector) {
      // eslint-disable-next-line no-new
      new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
        hideElement: 'AddressProvinceContainerNew',
      });
      this.elements.countrySelects.forEach((select) => {
        const formId = select.dataset.formId;
        // eslint-disable-next-line no-new
        new Shopify.CountryProvinceSelector(`AddressCountry_${formId}`, `AddressProvince_${formId}`, {
          hideElement: `AddressProvinceContainer_${formId}`,
        });
      });
    }
  }

  _setupEventListeners() {
    this.elements.toggleButtons.forEach((element) => {
      element.addEventListener('click', this._handleAddEditButtonClick);
    });
    this.elements.cancelButtons.forEach((element) => {
      element.addEventListener('click', this._handleCancelButtonClick);
    });
    this.elements.deleteButtons.forEach((element) => {
      element.addEventListener('click', this._handleDeleteButtonClick);
    });
  }

  _toggleExpanded(target) {
    target.setAttribute(attributes.expanded, (target.getAttribute(attributes.expanded) === 'false').toString());
  }

  _handleAddEditButtonClick = ({ currentTarget }) => {
    this._toggleExpanded(currentTarget);
  };

  _handleCancelButtonClick = ({ currentTarget }) => {
    this._toggleExpanded(currentTarget.closest(selectors.addressContainer).querySelector(`[${attributes.expanded}]`));
  };

  _handleDeleteButtonClick = ({ currentTarget }) => {
    // eslint-disable-next-line no-alert
    if (confirm(currentTarget.getAttribute(attributes.confirmMessage))) {
      Shopify.postLink(currentTarget.dataset.target, {
        parameters: { _method: 'delete' },
      });
    }
  };
}


document.addEventListener('DOMContentLoaded', function () {
  // Add Address
  const addBtn = document.querySelector('[aria-controls="AddAddress"]');
  const addForm = document.getElementById('AddAddress');
  if (addBtn && addForm) {
    addForm.style.display = 'none';
    addBtn.addEventListener('click', function () {
      addForm.style.display = 'block';
      document.querySelectorAll('[id^="EditAddress_"]').forEach(f => f.style.display = 'none');
    });
    addForm.querySelector('button[type="reset"]').addEventListener('click', function () {
      addForm.style.display = 'none';
    });
  }

  // Edit Address
  document.querySelectorAll('[id^="EditFormButton_"]').forEach(function (editBtn) {
    editBtn.addEventListener('click', function () {
      const id = editBtn.getAttribute('data-address-id');
      document.getElementById('AddAddress').style.display = 'none';
      document.querySelectorAll('[id^="EditAddress_"]').forEach(f => f.style.display = 'none');
      const editForm = document.getElementById('EditAddress_' + id);
      if (editForm) editForm.style.display = 'block';
    });
  });

  // Cancel in Edit Address
  document.querySelectorAll('[id^="EditAddress_"]').forEach(function (editForm) {
    editForm.style.display = 'none';
    const cancelBtn = editForm.querySelector('button[type="reset"]');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function () {
        editForm.style.display = 'none';
      });
    }
  });
});