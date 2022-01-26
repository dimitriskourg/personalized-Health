package servlets;

import database.tables.EditMessageTable;
import database.tables.EditSimpleUserTable;
import mainClasses.JSON_Converter;
import mainClasses.Message;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;

@WebServlet(name = "CreateMessage", value = "/CreateMessage")
public class CreateMessage extends HttpServlet {


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintWriter out1 = response.getWriter();
        JSONObject ret = new JSONObject();
        JSON_Converter converter = new JSON_Converter();
        JSONObject jo = new JSONObject(converter.getJSONFromAjax(request.getReader()));
        EditMessageTable messageTable = new EditMessageTable();
        EditSimpleUserTable userTable = new EditSimpleUserTable();

        int doctor_id = jo.getInt("doctor_id");
        int user_id = jo.getInt("user_id");
        String msg = jo.getString("message");
        String sender = jo.getString("sender");

        Date date = new Date();
        SimpleDateFormat ft = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        System.out.println(ft.format(date));
        try {
            int blooddonor = userTable.databaseToSimpleUser(user_id).getBlooddonor();
            String bloodtype = userTable.databaseToSimpleUser(user_id).getBloodtype();

            Message message = new Message();
            message.setDoctor_id(doctor_id);
            message.setUser_id(doctor_id);
            message.setMessage(msg);
            message.setSender(sender);
            message.setBloodtype(bloodtype);
            message.setBlood_donation(blooddonor);
            message.setDate_time(ft.format(date));

            messageTable.createNewMessage(message);

            ret.put("success","message sent");
            response.setStatus(200);
            out1.println(ret);


        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            ret.put("error","internal error");
            response.setStatus(403);
            out1.println(ret);
        }



    }
}
