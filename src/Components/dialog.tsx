import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';



const DialogBox = (props: {isDialogOpen : boolean, handleDialogClose : () => void}) => {


    return (
        <>
<Dialog open={props.isDialogOpen} onClose={props.handleDialogClose}>
  <DialogTitle>Note</DialogTitle>
  <DialogContent>
    <p>This is the content of the dialog box.</p>
    <p>You can customize the content based on your requirements.</p>
  </DialogContent>
  <DialogActions>
    <Button onClick={props.handleDialogClose}>Close</Button>
  </DialogActions>
</Dialog>
</>
    )
    
}

export default DialogBox;