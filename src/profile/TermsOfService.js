import React from 'react'
import { strings } from "../libs/strings";
import Modal from '../components/Modal';
import LoaderButton from "../components/LoaderButton";

export default function TermsOfService({isLoading, open, onClickAgree, onClose}) {
  return (
    <React.Fragment>
      <Modal
          open={open}
          onClose={onClose}
        >
          <React.Fragment>
            <h2>Terms of Service</h2>
            <br/>
            <p>{strings.en.termsOfService}</p>
            <div >
              <LoaderButton
                style={{marginLeft: 'auto'}}
                block
                bsSize="small"
                isLoading={isLoading}
                onClick={onClickAgree}
                text="I Agree"
              />
            </div>
          </React.Fragment>
        </Modal>
    </React.Fragment>
  )
}
