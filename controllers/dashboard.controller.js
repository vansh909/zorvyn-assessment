const userModel = require('../models/user.model');
const financialRecord = require('../models/records.model');
const validator = require("validator");

exports.getDashboard = async(req, res)=>{
    const user = req.user;
    const { email } = req.body;
    const userIdFromParams = req.params.id;

    try {

        let filter = {};

        // 👑 admin
        if(user.role == 'admin'){
            if(email){
                if(!validator.isEmail(email))
                    return res.status(400).json("Invalid email!");

                const targetUser = await userModel.findOne({ email: email });
                if(!targetUser) return res.status(404).json("User not found!");

                filter = { userId: targetUser._id };
            }
            else{
                filter = {};
            }
        }

        // 📊 analyst / 👁️ viewer
        else{
            if(!userIdFromParams)
                return res.status(400).json("User ID required in params!");

            if(userIdFromParams != user.id)
                return res.status(403).json("Unauthorized!");

            filter = { userId: user.id };
        }

        const records = await financialRecord.find(filter);

        // 🟢 no records
        if(records.length === 0){
            return res.status(200).json({
                message: "No records found",
                data: {
                    totalIncome: 0,
                    totalExpense: 0,
                    balance: 0,
                    categoryTotals: {},
                    recent: [],
                    monthlyTrends: {}
                }
            });
        }

        let totalIncome = 0;
        let totalExpense = 0;
        let categoryTotals = {};
        let monthlyTrends = {};

        records.forEach((record)=>{

            // totals
            if(record.type === 'income'){
                totalIncome += record.amount;
            }
            else{
                totalExpense += record.amount;
            }

            // category-wise
            if(!categoryTotals[record.category]){
                categoryTotals[record.category] = {
                    income: 0,
                    expense: 0
                };
            }

            if(record.type === 'income'){
                categoryTotals[record.category].income += record.amount;
            }
            else{
                categoryTotals[record.category].expense += record.amount;
            }

            // 🔥 monthly trends
            const month = new Date(record.date).toLocaleString('default', { month: 'short', year: 'numeric' });

            if(!monthlyTrends[month]){
                monthlyTrends[month] = {
                    income: 0,
                    expense: 0
                };
            }

            if(record.type === 'income'){
                monthlyTrends[month].income += record.amount;
            }
            else{
                monthlyTrends[month].expense += record.amount;
            }
        });

        const balance = totalIncome - totalExpense;

        // 🔥 recent
        const recent = records
            .sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0,5);

        return res.status(200).json({
            message: "Dashboard fetched successfully",
            data: {
                totalIncome,
                totalExpense,
                balance,
                categoryTotals,
                recent,
                monthlyTrends
            }
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};