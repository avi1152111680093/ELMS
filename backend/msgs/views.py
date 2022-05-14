from rest_framework.views import APIView
from leaves.models import Leave
from rest_framework.response import Response
from msgs.models import Message

from msgs.serializers import MessageSerializer

# Create your views here.


class MessagesView (APIView):
    def get(self, request, leave_id):
        leave = Leave.objects.get(id=leave_id)
        query_set = leave.message_set.all().order_by('send_on')
        return Response(MessageSerializer(query_set, many=True).data)


class MessageSendView (APIView):
    def post(self, request):
        msg = request.data.get('msg')
        msg_from = request.data.get('from')
        leave_id = request.data.get('leave_id')

        leave = Leave.objects.get(id=leave_id)
        _message = Message(leave=leave, msg_from=msg_from, msg=msg)
        _message.save()

        return Response({
            'status': 'Succefully sent'
        })
