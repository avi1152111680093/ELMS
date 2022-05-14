from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
import json


class UpdateUserConsumer (AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = 'update-user-group'
        await self.channel_layer.group_add(
            self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print('received: ', text_data_json)
        admin = text_data_json['admin']
        employee = text_data_json['employee']
        manager = text_data_json['manager']
        action = text_data_json['action']

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'send_message',
                'admin': text_data_json['admin'],
                'employee': text_data_json['employee'],
                'manager': text_data_json['manager'],
                'action': text_data_json['action']
            }
        )

    async def send_message(self, event):
        admin = event['admin']
        employee = event['employee']
        manager = event['manager']
        action = event['action']
        await self.send(text_data=json.dumps({
            'admin': admin,
            'employee': employee,
            'manager': manager,
            'action': action,
        }))


class DeletedUserLogoutConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = 'logout-user-group'
        await self.channel_layer.group_add(
            self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print('received: ', text_data_json)
        admin = text_data_json['admin']
        employee = text_data_json['employee']
        manager = text_data_json['manager']

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'send_message',
                'admin': text_data_json['admin'],
                'employee': text_data_json['employee'],
                'manager': text_data_json['manager']

            }
        )

    async def send_message(self, event):
        admin = event['admin']
        employee = event['employee']
        manager = event['manager']
        await self.send(text_data=json.dumps({
            'admin': admin,
            'employee': employee,
            'manager': manager
        }))

# class UpdateManagerConsumer (WebsocketConsumer):
#     def connect(self):
#         self.group_name = 'manager-dashboard-update'
#         async_to_sync(self.channel_layer.group_add)(
#             self.group_name, self.channel_name)
#         self.accept()

#     def disconnect(self):
#         async_to_sync(self.channel_layer.group_discard)(
#             self.group_name,
#             self.channel_name
#         )

#     def receive(self, text_data):
#         text_data_json = json.loads(text_data)
#         message = text_data_json['message']

#         async_to_sync(self.channel_layer.group_send)(
#             self.group_name,
#             {
#                 'type': 'send_message',
#                 'message': message
#             }
#         )

#     def send_message(self, event):
#         message = event['message']
#         self.send(text_data=json.dumps({
#             'message': message
#         }))
