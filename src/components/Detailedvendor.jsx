import React, { useState, useEffect } from 'react'; 
import { useForm, useFieldArray } from 'react-hook-form';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/DetailedVendor.css';
import {postVendorInfo} from './services/VendorInfoService';
function Detailedvendor() {
  const { register, control, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      directors: [{}],  // start with one director
    }
  });
  const { fields: directors, append, remove } = useFieldArray({
    control,
    name: 'directors',
  });

  const [isOtherService, setIsOtherService] = useState(false);

  const serviceType = watch('serviceType');

  useEffect(() => {
    setIsOtherService(serviceType === 'Others');
    if (serviceType !== 'Others') {
      setValue('serviceTypeOther', '');
    }
  }, [serviceType, setValue]);

// const onSubmit = async (data) => {
//   try {
//     const formData = new FormData();

//     const { chequeImage, ...rest } = data;

//     formData.append('form', JSON.stringify(rest));

//     if (chequeImage && chequeImage.length > 0) {
//       formData.append('chequeImage', chequeImage[0]);
//     }

//     await Axios.post('http://localhost:8082/api/vendorInfo/submit', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     toast.success('Registration successful');
//   } catch (error) {
//     console.error(error);
//     toast.error('Registration failed');
//   }
// };

const onSubmit = async (data) => {
  try {
    const {
      bankName,
      accountName,
      accountNumber,
      ifscCode,
      branchAddress,
      chequeImage,
      ...rest
    } = data;

    // Nest bankDetails
    const formattedData = {
      ...rest,
      bankDetails: {
        bankName,
        accountName,
        accountNumber,
        ifscCode,
        branchAddress,
        chequeImagePath: null, // backend can fill this later
      },
    };

    const formData = new FormData();
    formData.append("form", new Blob([JSON.stringify(formattedData)], { type: "application/json" }));

    if (chequeImage && chequeImage.length > 0) {
      formData.append('chequeImage', chequeImage[0]);
    }

    // await Axios.post("http://localhost:8082/api/vendorInfo/submit", formData, {
  postVendorInfo(formData,{
    headers: {
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true,
});


    toast.success('Registration successful');
  } catch (error) {
    console.error(error);
    toast.error('Registration failed');
  }
};


  return (
    <div className="vendor-registration-form">
      <h2>Vendor Registration Form</h2>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">

        {/* Company Details */}
        <section>
          <h3>Company Details</h3>

          <div className="form-group">
            <label>Company Name <span className="required">*</span></label>
            <input
              type="text"
              placeholder="Company Name"
              {...register('companyName', { required: 'Company name is required' })}
            />
            {errors.companyName && <p className="error">{errors.companyName.message}</p>}
          </div>

          <div className="form-group">
            <label>Address <span className="required">*</span></label>
            <textarea
              placeholder="Address"
              {...register('address', { required: 'Address is required' })}
            />
            {errors.address && <p className="error">{errors.address.message}</p>}
          </div>

          <div className="form-group">
            <label>City <span className="required">*</span></label>
            <input
              type="text"
              placeholder="City"
              {...register('city', { required: 'City is required' })}
            />
            {errors.city && <p className="error">{errors.city.message}</p>}
          </div>

          <div className="form-group">
            <label>Pin Code <span className="required">*</span></label>
            <input
              type="text"
              placeholder="Pin Code"
              {...register('pinCode', { required: 'Pin code is required' })}
            />
            {errors.pinCode && <p className="error">{errors.pinCode.message}</p>}
          </div>

          <div className="form-group">
            <label>Telephone No <span className="required">*</span></label>
            <input
              type="text"
              placeholder="Telephone No"
              {...register('telephone', { required: 'Telephone number is required' })}
            />
            {errors.telephone && <p className="error">{errors.telephone.message}</p>}
          </div>

          <div className="form-group">
            <label>Mobile No <span className="required">*</span></label>
            <input
              type="text"
              placeholder="Mobile No"
              {...register('mobile', { required: 'Mobile number is required' })}
            />
            {errors.mobile && <p className="error">{errors.mobile.message}</p>}
          </div>

          <div className="form-group">
            <label>E-mail Address <span className="required">*</span></label>
            <input
              type="email"
              placeholder="E-mail Address"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>

          <div className="form-group">
            <label>Contact Person <span className="required">*</span></label>
            <input
              type="text"
              placeholder="Contact Person"
              {...register('contactPerson', { required: 'Contact person is required' })}
            />
            {errors.contactPerson && <p className="error">{errors.contactPerson.message}</p>}
          </div>
        </section>

        {/* Directors / Partners */}
        <section>
          <h3>Directors / Partners / Proprietor Details</h3>
          {directors.map((director, index) => (
            <div key={director.id} className="director-block">
              <div className="form-group">
                <label>Name <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="Name"
                  {...register(`directors.${index}.name`, { required: 'Director name is required' })}
                />
                {errors.directors?.[index]?.name && (
                  <p className="error">{errors.directors[index].name.message}</p>
                )}
              </div>

              <div className="form-group">
                <label>Designation <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="Designation"
                  {...register(`directors.${index}.designation`, { required: 'Designation is required' })}
                />
                {errors.directors?.[index]?.designation && (
                  <p className="error">{errors.directors[index].designation.message}</p>
                )}
              </div>

              <div className="form-group">
                <label>Residential Address <span className="required">*</span></label>
                <textarea
                  placeholder="Residential Address"
                  {...register(`directors.${index}.address`, { required: 'Address is required' })}
                />
                {errors.directors?.[index]?.address && (
                  <p className="error">{errors.directors[index].address.message}</p>
                )}
              </div>

              <div className="form-group">
                <label>Telephone/Cell No <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="Telephone/Cell No"
                  {...register(`directors.${index}.phone`, { required: 'Phone number is required' })}
                />
                {errors.directors?.[index]?.phone && (
                  <p className="error">{errors.directors[index].phone.message}</p>
                )}
              </div>

              <button type="button" onClick={() => remove(index)} className="remove-btn">Remove Director</button>
            </div>
          ))}
          <button type="button" onClick={() => append({})} className="add-btn">Add Director</button>
        </section>

        {/* Statutory Data */}
        <section>
          <h3>Statutory Data</h3>
          <div className="form-group">
            <label>PAN <span className="required">*</span></label>
            <input
              type="text"
              placeholder="PAN Number"
              {...register('pan', { required: 'PAN is required' })}
            />
            {errors.pan && <p className="error">{errors.pan.message}</p>}
          </div>

          <div className="form-group">
            <label>GST No. <span className="required">*</span></label>
            <input
              type="text"
              placeholder="GST Number"
              {...register('gst', { required: 'GST number is required' })}
            />
            {errors.gst && <p className="error">{errors.gst.message}</p>}
          </div>

          <div className="form-group">
            <label>MSME No. <span className="required">*</span></label>
            <input
              type="text"
              placeholder="MSME Number"
              {...register('msme', { required: 'MSME number is required' })}
            />
            {errors.msme && <p className="error">{errors.msme.message}</p>}
          </div>
        </section>

        {/* Service Type */}
        <section>
          <h3>Nature of Work / Service Provided</h3>
          <label>
            <input
              type="radio"
              value="Sub-contractor"
              {...register('serviceType', { required: 'Please select a service type' })}
            />
            Sub-contractor
          </label>
          <label>
            <input
              type="radio"
              value="Advertisement/Publicity"
              {...register('serviceType')}
            />
            Advertisement/Publicity
          </label>
          <label>
            <input
              type="radio"
              value="Professional Services"
              {...register('serviceType')}
            />
            Professional Services
          </label>
          <label>
            <input
              type="radio"
              value="Others"
              {...register('serviceType')}
            />
            Others
          </label>

          {isOtherService && (
            <div className="form-group">
              <label>Specify Other Service Type</label>
              <input
                type="text"
                placeholder="Please specify"
                {...register('serviceTypeOther')}
              />
            </div>
          )}

          {errors.serviceType && <p className="error">{errors.serviceType.message}</p>}
        </section>

        {/* Bank Details */}
        <section>
          <h3>NEFT / RTGS Details</h3>

          <div className="form-group">
            <label>Bank Name <span className="required">*</span></label>
            <input
              type="text"
              placeholder="Bank Name"
              {...register('bankName', { required: 'Bank Name is required' })}
            />
            {errors.bankName && <p className="error">{errors.bankName.message}</p>}
          </div>

          <div className="form-group">
            <label>Account Name <span className="required">*</span></label>
            <input
              type="text"
              placeholder="Account Name"
              {...register('accountName', { required: 'Account Name is required' })}
            />
            {errors.accountName && <p className="error">{errors.accountName.message}</p>}
          </div>

          <div className="form-group">
            <label>Account Number <span className="required">*</span></label>
            <input
              type="text"
              placeholder="Account Number"
              {...register('accountNumber', { required: 'Account Number is required' })}
            />
            {errors.accountNumber && <p className="error">{errors.accountNumber.message}</p>}
          </div>

          <div className="form-group">
            <label>IFSC Code <span className="required">*</span></label>
            <input
              type="text"
              placeholder="IFSC Code"
              {...register('ifscCode', { required: 'IFSC Code is required' })}
            />
            {errors.ifscCode && <p className="error">{errors.ifscCode.message}</p>}
          </div>

          <div className="form-group">
            <label>Branch Address <span className="required">*</span></label>
            <textarea
              placeholder="Branch Address"
              {...register('branchAddress', { required: 'Branch Address is required' })}
            />
            {errors.branchAddress && <p className="error">{errors.branchAddress.message}</p>}
          </div>

          <div className="form-group">
            <label>Attach Cancelled Cheque <span className="required">*</span></label>
            <input
              type="file"
              accept="image/*"
              {...register('chequeImage', { required: 'Cancelled cheque image is required' })}
            />
            {errors.chequeImage && <p className="error">{errors.chequeImage.message}</p>}
          </div>
        </section>

        {/* Declaration */}
        <section>
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                {...register('declaration', { required: 'You must accept the declaration' })}
              />
              I hereby declare that the information furnished in this form is correct to the best of my knowledge. I undertake to inform you at the earliest of any change in the details mentioned in this form.
            </label>
            {errors.declaration && <p className="error">{errors.declaration.message}</p>}
          </div>
        </section>

        {/* Submit Button */}
        <button type="submit" className="submit-btn">Submit</button>
      </form>

      <ToastContainer />
    </div>
  );
}

export default Detailedvendor;
