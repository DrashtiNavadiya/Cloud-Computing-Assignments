const { Router } = require("express");
const router = Router();
const userController = require("../controller/UserContoller");

router.get("/get/all", userController.getAllUsers);
router.get("/get/:id", userController.getUserById);

router.put("/update/:id", userController.updateUser);

router.post("/add", userController.addUser);

router.delete("/delete/:id", userController.deleteUserById);

module.exports = router;
