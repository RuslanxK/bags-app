"use client"

import { Stack, Typography, IconButton, Box, TextField, Button, Container} from '@mui/material'
import Category from '../components/Category'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useTransition, useState, useEffect} from 'react';
import { useTheme } from '@emotion/react';
import DrawOutlinedIcon from "@mui/icons-material/DrawOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import MuiPopup from './custom/MuiPopup';
import CloseIcon from "@mui/icons-material/Close";
import MonitorWeightOutlinedIcon from "@mui/icons-material/MonitorWeightOutlined";
import DataSaverOffOutlinedIcon from "@mui/icons-material/DataSaverOffOutlined";
import NordicWalkingIcon from '@mui/icons-material/NordicWalking';
import { PieChart, pieArcLabelClasses} from "@mui/x-charts/PieChart";
import SideItem from '../components/SideItem'
import FlipCameraIosOutlinedIcon from '@mui/icons-material/FlipCameraIosOutlined';


const InnerBag = ({bagData, items, bags, session}) => {

  const router = useRouter();
  const theme = useTheme()

  const [isTransitionStarted, startTransition] = useTransition();
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [editedBag, setEditedBag] = useState({tripId: bagData?.bag?.tripId, name: bagData?.bag?.name, goal: bagData?.bag?.goal, description: bagData?.bag?.description})
  const [showSideBarMobile, setShowSideBarMobile] = useState(false)
  const [tripId, setTripId] = useState()
  const [bagId, setBagId] = useState()

  const handleChange = (event) => {
    let { name, value } = event.target;
    setEditedBag({ ...editedBag, [name]: value });
  };

  
  
  const allBagsItems = items.map((item) => { return <SideItem key={item._id} itemData={item} color="white" categoryData={bagData?.categories} update={() => startTransition(router.refresh)}  /> }) 

  const categories = bagData?.categories?.map((category) => <Category key={category._id} categoryData={category} items={bagData?.items} session={session} />)
  const itemsTotal = bagData?.items?.reduce((acc, item) => acc + item.qty, 0) 

  const categoryWeightsArr = bagData?.totalWeightCategory 
  const categoryPieChartData = bagData?.categories?.slice(0,6).map((category) => {  
  const categoryWeight = categoryWeightsArr?.categoriesTotalWeight?.find((item) => item.categoryId === category._id)

        return {
          id: category._id,
          value: categoryWeight?.totalWeight || 0 ,
          label: category?.name?.length > 6 ? `${categoryWeight?.totalWeight?.toFixed(2) || 0.00} kg - ${category?.name?.substring(0, 6)}...` : `${categoryWeight?.totalWeight?.toFixed(2) || 0.00} kg - ${category?.name}`
        };
      })
    ;

  const TOTAL = categoryWeightsArr?.categoriesTotalWeight?.map((category) => category.totalWeight).reduce((a, b) => a + b, 0) 
  const getArcLabel = (params) => {
    const percent = params.value / TOTAL;
    return `${(percent * 100).toFixed(0)}%`;
  };


  const addCategory = async () => {
    const newCategory = {userId: session?.user?.id, bagId: bagData?.bag?._id, tripId: bagData?.bag?.tripId, name: 'new category' };
    try {
      const res = await axios.post('/categories/new', newCategory);
      startTransition(router.refresh)
    } catch (err) {
      console.log(err);
    }
  };


  const openPopup = () => {
      setPopupOpen(true)
  }

  const closePopup = () => {
    setPopupOpen(false);
    setDeletePopupOpen(false)
  };

  const openRemovePopup = () => {
    setDeletePopupOpen(true)
}


  const updateBag = async (e) => {
     e.preventDefault()
    try {
        await axios.put(`/bags/${bagData.bag._id}`, editedBag)
        setPopupOpen(false)
        startTransition(router.refresh);
    }
     catch (error) {
        console.log(error)
     }
  }


  const removeBag = async () => {
    try {
      await axios.delete(`/bags/${bagData.bag._id}`);
      setDeletePopupOpen(false)
      router.push(`/trips?id=${bagData.bag.tripId}`)
      startTransition(router.refresh);
      
    }
     catch (error) {
        console.log(error)
     }
  }


  const showHideSideBar  = () => {
    setShowSideBarMobile(!showSideBarMobile)
  }

  return (

    <Container sx={{display: "flex"}} maxWidth={false} disableGutters>
    { items?.length ? <div className="side-bar-icon-mobile"><IconButton onClick={showHideSideBar} sx={{ width: "55px", height: "55px", zIndex: "99", borderRadius: "100%", position: "fixed", bottom: "15px", left: "15px", backgroundColor: theme.green, color: "white", "&:hover": {backgroundColor: "#32CD32"}}}>{showSideBarMobile === true ? <CloseIcon /> : <FlipCameraIosOutlinedIcon /> }</IconButton></div> : null }

    <Box display="flex" flexDirection="row" width={theme.fullWidth} backgroundColor={theme.main.lightestGray} minHeight="100vh"height="100%">
    <Stack display={theme.flexBox} justifyContent={theme.start} width={theme.fullWidth} pb={7}>

        <div className="main-info">
       <Stack display={theme.flexBox} flexDirection={theme.row} alignItems={theme.center}>
        <Typography component="h2" variant='span' fontWeight="600">{bagData?.bag?.name}</Typography>
        <DrawOutlinedIcon sx={{ marginLeft: "15px", cursor: "pointer", "&:hover": { color: theme.orange } }} onClick={openPopup} />
        <DeleteOutlineOutlinedIcon sx={{ marginLeft: "5px", cursor: "pointer", "&:hover": { color: "red" } }} onClick={openRemovePopup} />
        </Stack>
        <Typography component="p" variant="p">
          {bagData?.bag?.description}
        </Typography>

        <Stack display={theme.flexBox} direction="row" flexWrap="wrap" justifyContent={theme.center} alignItems={theme.contentCenter} backgroundColor={theme.main.lightGray} mt={2} pt={1} pb={1} pl={1} pr={1} width="fit-content" borderRadius={theme.radius}>
    
        <MonitorWeightOutlinedIcon sx={{  marginRight: "5px" }}/> 
        { bagData?.totalBagWeight > bagData?.bag?.goal ?  <Typography variant="span" component="span" sx={{ fontWeight: "bold", color: "red" }}>{bagData?.totalBagWeight?.toFixed(1)} / {bagData?.bag?.goal} kg </Typography> :  <Typography variant="span" component="span" sx={{ fontWeight: "bold", color: bagData?.totalBagWeight > 0.00 ? theme.green : "black" }}> {bagData?.totalBagWeight?.toFixed(1)} / {bagData?.bag?.goal} kg </Typography>  }
        <NordicWalkingIcon sx={{ marginLeft: "15px", marginRight: "5px" }}/>
        <Typography variant="span" component="span"> { bagData?.worn ? "worn " + bagData?.worn?.toFixed(1) + " kg" : "0.0 kg"}</Typography>
        <DataSaverOffOutlinedIcon sx={{ marginLeft: "15px", marginRight: "5px" }}/> {itemsTotal} items 
         </Stack> 
      </div>

    { itemsTotal ?  <Stack mb={2}>
      <PieChart margin={{ top: 0, left:0, right:0, bottom: 0}} 
       series={[{
           data: categoryPieChartData,
           faded: {innerRadius: 30, additionalRadius: -15, color: 'gray'},
           highlightScope: { faded: 'global', highlighted: 'item' },
           arcLabel: getArcLabel,
           innerRadius: 35,
           outerRadius: 110,
           paddingAngle: 5,
           cornerRadius: 5,
           startAngle: -180,
           endAngle: 180,
           cx: 180,
           cy: 150,
         },
       ]}
       sx={{[`& .${pieArcLabelClasses.root}`]: { fill: 'white', fontSize: 14, fontWeight: "300"}, visibility: itemsTotal ? "visible" :  "hidden"}}
    
       height={380}
       tooltip={{}}
       slotProps={{ legend: { direction: "row", position: { vertical: "bottom", horizontal: "center" }}}}
       
       />

      </Stack> : null }


    <div className="categories">
    <Stack border="1px dashed gray" borderRadius={theme.radius} display={theme.flexBox} justifyContent={theme.center} alignItems={theme.center}
     backgroundColor={theme.main.lightGray} width={theme.category.width} height={theme.category.height} mb={1} sx={{cursor: "pointer"}} onClick={addCategory}>
    <IconButton><AddOutlinedIcon sx={{fontSize: "25px", color: "gray" }}/></IconButton>
    </Stack>
    {categories}
    </div>

    </Stack>
   

    
     {items?.length ? 
     <div className="recent-desktop">
     <Stack width={theme.nav.width} height={theme.nav.height}>
     <Stack pt={2} display={theme.flexBox} alignItems={theme.left} position={theme.nav.fixed} height={theme.nav.height} width={theme.nav.width}  sx={{backgroundColor: theme.green}}>
     <Typography component="h3" variant="span" textAlign="center" color="white">Recent Items</Typography>
     <Typography component="span" variant="span" textAlign="center" mb={3} color={theme.main.lightGray}>added to your plans</Typography>
     <Stack sx={{overflowY: "scroll"}} height="85.5vh" pl={3}>
     {allBagsItems}
     </Stack>
     </Stack>
     </Stack> 
     </div> : null }


     {items?.length && showSideBarMobile  ? 

     
     <div className="recent-mobile">
     <Stack width="185px" height={theme.nav.height}>
     <Stack pt={2} display={theme.flexBox} alignItems={theme.left} position={theme.nav.fixed} height={theme.nav.height} width="185px"  sx={{backgroundColor: theme.green}}>
     <Typography component="h3" variant="span" textAlign="center" color="white">Recent Items</Typography>
     <Typography component="span" variant="span" textAlign="center" mb={3} color={theme.main.lightGray}>added to your plans</Typography>
     <Stack sx={{overflowY: "scroll"}} height="85.5vh" pl={3}>
     {allBagsItems}
     </Stack>
     </Stack>
     </Stack> 
     </div> : null }
    

     { isPopupOpen ?  <MuiPopup isOpen={isPopupOpen} onClose={closePopup} >
        <form onSubmit={updateBag}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap">
             <Stack width="90%">
             <Typography variant='span' component="h2">Update Bag</Typography>
             <Typography variant='span' component="span" mb={3}>Popup content goes here</Typography>
             </Stack>
             <CloseIcon onClick={closePopup} sx={{cursor: "pointer"}}/>
             <TextField label="Bag name" name="name" required onChange={handleChange} sx={{width: "48.5%", marginBottom: "20px"}} value={editedBag.name || ""} inputProps={{ maxLength: 26 }}/>
             <TextField label="Weight goal (kg)" type="number" required name="goal" onChange={handleChange} sx={{width: "48.5%", marginBottom: "20px"}} value={editedBag.goal || ""} inputProps={{ min: 1, max: 99 }} />
            <TextField multiline label="Description" name="description" required onChange={handleChange} sx={{width: "100%"}} value={editedBag.description || "" } inputProps={{ maxLength: 200 }} /> 
            <Button type="submit"  sx={{padding: "13px", marginTop: "20px", width: "100%", fontWeight: "500", backgroundColor: theme.green}} variant="contained" disableElevation>Update</Button>
          </Stack>
      </form>
  </MuiPopup> : null }

{ isDeletePopupOpen ? <MuiPopup isOpen={isDeletePopupOpen} onClose={closePopup}>
<Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap">
<Stack width="90%">
<Typography variant='span' component="h2" mb={1.5}>Delete Bag</Typography>
<Typography variant='span' component="span">
   Are you sure you want to delete this bag? This action cannot be undone.
   Deleting this bag will permanently remove it from the system, and any associated data will be lost.</Typography>
</Stack>

<CloseIcon onClick={closePopup} sx={{cursor: "pointer"}}/>
<Button sx={{padding: "13px", marginTop: "20px", width: "100%", fontWeight: "500", backgroundColor: theme.red, '&:hover': {backgroundColor: theme.redHover}}} variant="contained" onClick={removeBag} disableElevation>Delete</Button>
</Stack>
</MuiPopup> : null }
    </Box>
    </Container>
  )
}

export default InnerBag