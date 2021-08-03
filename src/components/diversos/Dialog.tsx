import React, {useContext} from 'react';
import Modal from 'react-modal';
import { GlobalContext } from 'contexts/context';
import { ButtonDialogProps } from './interfaces';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > svg': {
        margin: theme.spacing(2),
      },
    },
  }),
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});






export function ButtonDialog(props : ButtonDialogProps) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    setOpen(false);
    props.action();
  };



function buttonType(type : string){
    switch (type) {
        case 'deleteIcon' :
            return (
                <DeleteIcon onClick={handleClickOpen} color="secondary" />
            );
        case 'deleteButton' :
            return (
                <button className="btn btn-outline-danger" onClick={handleClickOpen}>{props.textbutton}</button>
            );
        default : 
            return (
                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    {props.textbutton}
                </Button> 
            );
    }
}

function messageButtons(type : string){
    switch (type) {
        case 'information' :
            return (
                <Button variant="contained" color="primary" onClick={handleClose} >
                    OK
                </Button>
            );
        default : 
            return (
                <>
                <button onClick={handleClose} className="btn btn-outline-danger">
                    Cancelar
                </button>
                <button onClick={handleConfirm} className="btn btn-success">
                    Confirmar
                </button>
                </>
            );
    }
}

  return (
    <>
      {buttonType(props.type)}


      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {props.msg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
            {messageButtons(props.type)}
        </DialogActions>
      </Dialog>
    </>
  );
}



Modal.setAppElement('#root');
export function MessageDialog() {
  const context = useContext(GlobalContext);

  function hancleCloseModal(){
    context.alterModalProps({...context.modalProps, isOpen : false});
  }

  return (
    <>
        {/* <Modal
          isOpen={context.modalProps.isOpen}
          onRequestClose={hancleCloseModal}
          contentLabel="Example Modal"
        >
 
        <h2>{context.modalProps.text}</h2>
        </Modal> */}

        <Dialog
        open={context.modalProps.isOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={hancleCloseModal}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{context.modalProps.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {context.modalProps.text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button onClick={hancleCloseModal} className="btn btn-success">
              Confirmar
          </button>
        </DialogActions>
      </Dialog>

    </>
  )
}