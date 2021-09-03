import React, { useEffect, useRef, useState } from "react";
import {useHistory} from 'react-router-dom';
import Order from "./Order";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "react-bootstrap/lib/Button";

/**
 * Paywall modal that shows advertising/marketing copy for the Pareto Full-Stack Starter Kit.
 * @TODO better UI, scrollable copy.
 * @TODO give people a hint, that if they fork the open-source code, they can unlock things for free. Or, they can buy to learn how to unlock.
 * @TODO create instructions for people to create their own local API's, ultimately release an API repository. Or convert into a mono-repo, update the CI instructions.
 */

function LoadingModal(props) {
  const [showPayment, setShowPayment] = useState(false);

  const history = useHistory();
  const modalRef = useRef();

  useEffect(()=>{
    let handleModalClose = (event) =>{
      if(!modalRef.current?.contains(event.target)){
        history.push('/'); 
        
      }
    }  
    document.addEventListener('mousedown', handleModalClose)

    return () => {
      document.removeEventListener('mousedown', handleModalClose)
    }
        
  },[showPayment]);

  return (
    <React.Fragment>
      <h1 style={{ textAlign: "center" }}>Pareto Full-Stack Starter Kit</h1>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/ukMisjPq7ec"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      />
      {showPayment === false ? (
        <DialogContent ref={modalRef} style={{ textAlign: "center" }}>
          <p>Included in your $89 purchase:</p>
          <ul style={{ listStyle: "none" }}>
            <li>
              14 laminated cheat sheets, with the 20% of knowledge needed to
              achieve 80% of the results you are looking for.
            </li>
            <li>
              52 flash-cards, which doubles as a deck of cards, to learn the
              core JavaScript methods & API's.
            </li>
            <li>
              Workflow stickers, helping you memorize crucial terminal commands
              using Git, AWS Amplify & Bash.
            </li>
            <li>
              Interactive, physical workbook to help you ideate your capstone
              portfolio project/product, design wireframe mockups, model the
              information to store in your database, create an architecture
              diagram, and more.{" "}
            </li>
            <li>Priority support & first access to new features.</li>
            <li>Lifetime access to the Knowledge Base & Arena</li>
          </ul>
          <Button className="btn-cancel" onClick={() => props.history.push("/")}>Cancel</Button>
          <Button onClick={() => setShowPayment(true)}>Purchase</Button>
        </DialogContent>
      ) : (
        <DialogContent ref={modalRef} style={{ textAlign: "start" }}>
          <div className='ConfirmPurchaseForm'>
            <Order {...props} />
            <Button onClick={() => setShowPayment(false)}>Back</Button>
          </div>
          

          
        </DialogContent>
      )}
    </React.Fragment>
  );
}

export default LoadingModal;
